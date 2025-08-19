import Step from "../ui/Step";

export default function StepsAppointment() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h3 className="text-2xl md:text-3xl font-bold mb-8">
        Quy trình đặt lịch
      </h3>
      <div className="grid md:grid-cols-4 gap-6">
        <Step n={1} title="Chọn dịch vụ" desc="Tắm, tỉa lông, spa…" />
        <Step n={2} title="Chọn thời gian" desc="Khung giờ trống phù hợp" />
        <Step n={3} title="Nhập thông tin" desc="Tên boss & liên hệ" />
        <Step n={4} title="Xác nhận" desc="Nhận thông báo qua email" />
      </div>
    </section>
  );
}
