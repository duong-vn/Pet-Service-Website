import { handleError } from "@/apiServices/services"
import LoadingScreen from "@/components/ui/LoadingScreen"
import { useAppSelector } from "@/hooks/redux-hooks"
import { useSession } from "@/hooks/session-hooks"
import { IService } from "@/types/back-end"
import { api } from "@/utils/axiosInstance"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { differenceInDays, format } from "date-fns"
import { motion } from "framer-motion"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Matcher, DayPicker, DateRange } from "react-day-picker"

export default function Appointments({service}:{service:string}){
    const phone = useAppSelector((s)=>s.auth.user?.phone)
    const [value,setValue,clear] = useSession<{petWeight:number,phone:string}>('services-appointments',{petWeight:0,phone:phone??''})
    
    const [selectedDate, setSelectedDate] = useState<Date>()
    const [selectedRangeDate,setSelectedRangeDate] = useState<DateRange>()
    const [selectedTime, setSelectedTime] = useState<string>('')
    const [notes, setNotes] = useState<string>('')
    const {data, isLoading,isError,error} = useQuery({
  
        queryFn: async ():Promise<IService>=>{ 
            const res = await api.get(`/api/services/${service}`)
            return res.data.data
        },
        queryKey:['services/:id',service]}
    
    )
   
    
    const toMinutes = (hhmm: string) => {
        const [hh, mm] = hhmm.split(':').map(Number);
        return hh * 60 + mm;
      };
     const minutesToTimeString = (totalMinutes: number): string => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
    
        // Đảm bảo luôn có 2 chữ số
        const paddedHours = hours.toString().padStart(2, '0');
        const paddedMinutes = minutes.toString().padStart(2, '0');
    
        return `${paddedHours}:${paddedMinutes}`;
      }
    const isDayMode = data?.duration!>=1440

    const { data:daySlots, isLoading:isDayLoading } = useQuery({
        enabled:!!!isDayMode,
        queryKey: ["day-slots",selectedDate],
        queryFn: async () => {
            const date = selectedDate?.toISOString().split('T')[0]
          const resData = (await api.post("/api/appointments/day-slots",{date,serviceId:service})).data;
          return resData.data.slots;
        },      });
     
    // Generate available time slots
    const timeSlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30'
    ]
  
  
    const today = new Date().toISOString().split('T')[0]
    
   
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    const maxDateStr = maxDate.toISOString().split('T')[0]
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      // Handle form submission here
      console.log({
        service,
       
        time: selectedTime,
        petWeight: value.petWeight,
        phone: value.phone,
        notes
      })
    }
  
    const handlePetWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const weight = parseFloat(e.target.value) || 0
      setValue({ ...value, petWeight: weight })
    }
  
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue({ ...value, phone: e.target.value })
    }
    const matcher : Matcher[] = [
      { before: new Date() }
     
    ];
   
    const datePicked = useMemo(()=>
        {
        if(isDayMode && !!selectedDate) return differenceInDays(selectedRangeDate?.to!,selectedRangeDate?.from!) + 1
        return 1;
    },[selectedRangeDate])
   
    if(isError ) {handleError(error); return null}
    if(isLoading)return <LoadingScreen/>
    return (
      <div className="min-h-screen  py-8">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-background-light dark:bg-primary-dark rounded-lg shadow-lg p-6"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Đặt Lịch Dịch Vụ
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6 rounded-full">
              {/* Service Info */}
              <div className="bg-blue-50 flex justify-between items-center p-4 rounded-lg">
                <div> <h2 className="text-lg font-semibold text-blue-800 mb-2">Thông Tin Dịch Vụ:</h2>
                <p className="text-blue-700">{data?.name!}</p></div>
               
                <Link href={'/services'} className="py-2 px-3 border-transparent border-2 text-black bg-primary-light/30 dark:bg-primary-dark/30 hover:border-primary-light rounded-3xl dark:hover:border-primary-dark hover:scale-105 transition-transform">Chọn lại</Link>
              </div>
  
              {/* Date Picker */}
              <div className="flex justify-center flex-col md:flex-row items-center gap-3"> 
  
               
              
            
              <div className="dark:bg-secondary-dark bg-secondary-light rounded-3xl p-3">
                
                { isDayMode ? <DayPicker
                 mode='range'
              
                disabled={matcher}
                required
                selected={selectedRangeDate}
                onSelect={()=>{
                    
                    setSelectedRangeDate}}                                  
               footer={
                selectedRangeDate?.from && selectedRangeDate.to
                  ? `Bạn đã chọn ${selectedRangeDate.from.toLocaleDateString()} đến ${selectedRangeDate?.to.toLocaleDateString()} .`
                  : "Hãy chọn khoảng thời gian."
              }
                /> : <DayPicker
                mode="single"
                required   
                disabled={matcher}             
                selected={selectedDate}
                onSelect={setSelectedDate}
                footer={
                selectedDate
                    ? `Bạn đã chọnchọn ${selectedDate.toLocaleDateString()}.`
                    : "Hãy chọn 1 ngày."
                    }
                        />
                         }
                            </div>
                <p className="text-xs   mt-1">
                  Chọn ngày từ hôm nay đến {maxDateStr}
                   {isDayMode
                    &&
                    <div className="opacity-45">(Ấn 2 lần để reset)</div>
                   }       
  
                </p>
  
              </div>
              {/* Time Picker */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn Giờ *
                </label>
                  {isDayLoading?

                   <select
                   disabled
                   className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

                   >
                    <option >Loading...</option>
                    </select> 
:
                <select
                  id="time"
                  required
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  disabled={isDayLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                   
                  <option value="">Chọn giờ</option>
                  {(isDayMode?timeSlots:daySlots).map((time:string) =>{ 
                    
                        if(!isDayMode && daySlots.length === 0){
                            
                            return <option key={time} >
                        Hết chỗ!
                      </option>}
                    console.log(daySlots.length)
                    return(
                    <option key={time} value={time}>
                      {time}
                    </option>
                  )})}
                </select>
                }
              </div>
  
              {/* Pet Weight */}
              <div>
                <label htmlFor="petWeight" className="block text-sm font-medium text-gray-700 mb-2">
                  Cân Nặng Thú Cưng (kg) * <span className="opacity-70">VD:6,7 hoặc 2</span>
                </label>
                <input
                  type="number"
                  id="petWeight"
                  required
                  min="0.1"
                  step="0.1"
                  value={value.petWeight || ''}
                  onChange={handlePetWeightChange}
                  placeholder="Nhập cân nặng thú cưng"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
  
              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Số Điện Thoại *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={value.phone}
                  onChange={handlePhoneChange}
                  placeholder="Nhập số điện thoại"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
  
              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi Chú
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập ghi chú nếu cần"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
  
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium text-lg"
              >
                Xác Nhận Đặt Lịch
              </button>
            </form>
  
            {/* Summary */}
            {(selectedDate || selectedRangeDate ) && selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <h3 className="text-lg font-semibold text-green-800 mb-2">Tóm Tắt Đặt Lịch</h3>
                <div className="space-y-1 text-green-700">
                  <p><span className="font-medium">Dịch vụ:</span> {service}</p>
                  <p><span className="font-medium">Ngày:</span> {isDayMode? <span> 

                    {selectedRangeDate?.from?.toLocaleDateString()}
                     {" "}đến {selectedRangeDate?.to?.toLocaleDateString()}

                  </span>: <p>{                
                selectedDate?.toLocaleDateString()
                
            }</p> 
                    
                    }
                  
                  </p>
                  <p><span className="font-medium">Giờ:</span> {selectedTime}</p>
                  <p><span className="font-medium">Cân nặng thú cưng:</span> {value.petWeight} kg</p>
                  <p><span className="font-medium">Số điện thoại:</span> {value.phone}</p>
                  {notes && <p><span className="font-medium">Ghi chú:</span> {notes}</p>}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }
  
