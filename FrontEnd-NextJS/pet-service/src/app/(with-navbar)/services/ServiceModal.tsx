import { delay, isNumericString } from "@/apiServices/services";
import { IService, PetType, ServiceType, Variant } from "@/types/back-end";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "sonner";
import { LuImagePlus } from "react-icons/lu";
import { uploadToCloud } from "@/apiServices/cloud/services";
import { patchService, postServices } from "@/apiServices/services/services";
import { useQueryClient } from "@tanstack/react-query";


interface IProps {
  close: () => void;
  serviceData?: IService;
}

const handleNumStringForForm = async (e:ChangeEvent<HTMLInputElement>,setValue: (value:string)=>void, setLoading : (value:boolean)=>void) =>{
    if(e.target.value === ''){
      setValue((e.target.value))
      return
    }
    if(!isNumericString(e.target.value)){
        toast.error('Phải nhập chuỗi số')
       
        setLoading(true)
         await delay(1000)
        setLoading(false)
    }else{
    setValue((e.target.value))}
  
  }


export default function ServiceModal({ close, serviceData }: IProps) {
  const qc = useQueryClient();
  const isUpdate = !!serviceData;
  const [loading,setLoading] = useState(false)
  const [name, setName] = useState(serviceData?.name ?? "");
  const [descriptionText, setDescriptionText] = useState(
    (serviceData?.description ?? []).join("\n")
  );
  const [duration, setDuration] = useState<string>(serviceData?.duration.toString() ?? '');
  const [priceStart, setPriceStart] = useState<string>(
    serviceData?.priceStart.toString() ?? ''
  );
  const [picture,setPicture] = useState<string>(serviceData?.picture ?? '/images/placeholders/meo.webp')
  const [priceEnd, setPriceEnd] = useState<string>(serviceData?.priceEnd.toString() ?? '');
  const [pet, setPet] = useState<PetType>(serviceData?.pet ?? PetType.DOG);
  const [type, setType] = useState<ServiceType>(
    serviceData?.type ?? ServiceType.BATH
  );
  const [variant, setVariant] = useState<Variant>(
    serviceData?.variant ?? Variant.STANDARD
  );
  const [file, setFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return  picture;
  }, [file]);

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(previewUrl);
    };
  }, [file, previewUrl]);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    if(priceStart > priceEnd){
      toast.error('Giá đầu phải nhỏ hơn giá cuối!')
     await delay(1000);
     setLoading(false)
     return;
    }
    let cloudPicture = null
    let public_id =serviceData?.public_id?? ' '
    if(file){
    const cloud = await uploadToCloud(`/images/services/${type}`,file)
    cloudPicture= cloud.secure_url
    public_id = cloud?.public_id
}

    const payload = {
      name,
      description: descriptionText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      duration: Number(duration) || 0,
      priceStart: Number(priceStart) || 0,
      priceEnd: Number(priceEnd) || 0,
      pet,
      type,
      public_id,
      variant,
      picture:cloudPicture??picture, // nếu có file thì backend sẽ xử lý, ở đây giữ URL để xem trước
      // file: file (nếu muốn gửi FormData thì xử lý ở nơi gọi API)
    } as IService
  
  
    if(isUpdate){
      const _id = serviceData._id
        await patchService(_id,payload)
    }else{
      await postServices(payload)
    }
    // TODO: gọi API create/update tại đây
    // if (isUpdate) await updateService(serviceData!.id, payload, file?)
    // else await createService(payload, file?)

    // Tạm thời log payload để kiểm tra
    qc.invalidateQueries({queryKey:['services']})
   setLoading(false)
    console.log(isUpdate ? "Update service" : "Create service", payload);
    close()
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
      />

      {/* Content */}
      <div className="fixed top-1/2 left-1/2 z-50 w-[80%] max-w-2xl max-h-[90%] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {isUpdate ? "Cập nhật dịch vụ" : "Tạo dịch vụ mới"}
          </h3>
          <button
            aria-label="Đóng"
            className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          {/* Cột trái: thông tin */}
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm">Tên dịch vụ</span>
              <input
                 disabled={loading}
                className="mt-1 w-full rounded-xl border p-2 dark:bg-neutral-800"
                placeholder="Ví dụ: Tắm cơ bản"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm">Mô tả (mỗi dòng là 1 ý)</span>
              <textarea
                className="mt-1 w-full hi xl:static rounded-xl border p-2 dark:bg-neutral-800"
                disabled={loading}
                rows={3}
                placeholder={"Gội xả sạch\nMassage\nDưỡng lông"}
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
              />
              
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm">Thời lượng (phút) </span>
                <span className="text-sm">1440 = 1 ngày</span>
                <input
                  type="text"
                  min={0}
                  disabled={loading}
                  className="mt-1 w-full rounded-xl border p-2 dark:bg-neutral-800"
                  value={duration}
                  onChange={async (e) => await handleNumStringForForm(e,setDuration,setLoading)}
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm">Biến thể</span>
                <select
                   disabled={loading}


                  className="mt-1 w-full rounded-xl border p-2 cursor-pointer dark:bg-neutral-800"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value as Variant)}
                >
                  {Object.values(Variant).map((v) => (
                    <option  key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm">Giá từ</span>
                <input
                  type="text"
                  disabled={loading}
                  min={0}
                  className="mt-1 w-full rounded-xl border p-2 dark:bg-neutral-800"
                  value={priceStart}
                  onChange={async (e) => await handleNumStringForForm(e,setPriceStart,setLoading)
                   }
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm">đến</span>
                <input
                  type="text"
                  min={0}
                  disabled={loading}
                  className="mt-1 w-full rounded-xl border p-2 dark:bg-neutral-800"
                  value={priceEnd}
                  onChange={async (e) => await handleNumStringForForm(e,setPriceEnd,setLoading)}
                  required
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm">Thú cưng</span>
                <select
                   disabled={loading}
                  className="mt-1 w-full rounded-xl  cursor-pointer border p-2 dark:bg-neutral-800"
                  value={pet}
                  onChange={(e) => setPet(e.target.value as PetType)}
                >
                  {Object.values(PetType).map((p) => (
                    <option key={p} value={p}>
                      {p === PetType.DOG ? "Chó" : p === PetType.CAT ? "Mèo" : "Khác"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm">Loại dịch vụ</span>
                <select
                  className="mt-1 w-full rounded-xl border cursor-pointer p-2 dark:bg-neutral-800"
                  value={type}
                  disabled={loading}
                  onChange={(e) => setType(e.target.value as ServiceType)}
                >
                  {Object.values(ServiceType).map((t) => (
                    <option key={t} value={t}>
                      {t === ServiceType.BATH
                        ? "Tắm"
                        : t === ServiceType.GROOMING
                        ? "Tỉa lông"
                        : t === ServiceType.HOTEL
                        ? "Khách sạn"
                        : "Khác"}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Cột phải: ảnh preview + nhập URL / upload */}
          <div className="space-y-3 ">
            <div className="hidden xl:block">
              <span className="text-sm">Ảnh xem trước</span>
              <div className="mt-2 xl:aspect-video w-full overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt={name || "preview"} className="h-full w-full object-cover" />
              </div>
            </div>

           

            <label className="block cursor-pointer bg-primary-light/80 hover:bg-primary-light p-2 rounded-2xl w-fit" htmlFor="uploadImage">
              <span  className=" flex items-center gap-2 text-sm"><LuImagePlus size={24} />  Tải ảnh lên  </span>
              <input
              disabled={loading}
                  id='uploadImage'
                type="file"
                accept="image/*"
                className="mt-1 w-full hidden rounded-xl border p-2 dark:bg-neutral-800"
                onChange={handleFile}
              />
            </label>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                disabled={loading}
                onClick={close}
                className="rounded-xl border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-primary-dark/80 hover:bg-primary-dark px-4 py-2 text-white hover:opacity-90 dark:bg-white dark:text-black"
              >
                {loading? <div className="w-5 h-5 m-auto border border-t-transparent animate-spin border-background-dark rounded-full bord">  </div>
                
                :
                
                isUpdate ? "Cập nhật" : "Lưu"

}

              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
