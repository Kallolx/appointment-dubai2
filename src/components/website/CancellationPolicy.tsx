const CancellationPolicy = () => {
  const policy = [
    {
      type: "15 minutes after placing the request",
      cancellationFee: "Free of charge",
      rescheduleFee: "Free of charge",
    },
    {
      type: "6+ hours before the booking",
      cancellationFee: "Free of charge",
      rescheduleFee: "Free of charge",
    },
    {
      type: "2–6 hours before the booking",
      cancellationFee: "50% of the booking value",
      rescheduleFee: "25% of the booking value",
    },
    {
      type: "Less than 2 hours before the booking",
      cancellationFee: "100% of the booking value",
      rescheduleFee: "50% of the booking value",
    },
    {
      type: "After start time",
      cancellationFee: "100% of the booking value",
      rescheduleFee: "50% of the booking value",
    },
  ];

  return (
    <section className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="overflow-x-auto flex-wrap">
          <table className="min-w-full text-left text-sm">
            <thead className=" text-gray-700">
              <tr>
                <th className="py-3 font-medium">Type</th>
                <th className="py-3  font-medium">Cancellation Fee</th>
                <th className="py-3  font-medium">
                  Reschedule Fee<span className="text-red-500">*</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {policy.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-3">{item.type}</td>
                  <td className="py-3">{item.cancellationFee}</td>
                  <td className="py-3">{item.rescheduleFee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="">
          <p className="text-xs text-red-500">
            *You can reschedule a cash-paid booking up to two times.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CancellationPolicy;
