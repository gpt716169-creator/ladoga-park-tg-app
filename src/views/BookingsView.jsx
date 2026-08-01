import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchTLBookingsList } from '../services/travelLineService';

export const BookingsView = () => {
  const { selectedProperty } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTLBookingsList(selectedProperty).then((data) => {
      setBookings(data || []);
      setLoading(false);
    });
  }, [selectedProperty]);

  return (
    <div className="space-y-6 pb-28">
      <div className="border-b border-[#c3f400]/20 pb-3 flex justify-between items-center">
        <div>
          <h2 className="font-['Syne'] font-extrabold text-[24px] sm:text-[32px] text-white uppercase tracking-wide">
            БРОНИРОВАНИЯ (LIVE API)
          </h2>
          <p className="font-['JetBrains_Mono'] text-[12px] text-[#a3a6a6]">
            // Прямые заезды из системы TravelLine (52159 / 54511)
          </p>
        </div>
        <span className="neon-badge font-['Manrope'] px-3 py-1 rounded-lg text-[12px] font-extrabold">
          {bookings.length} броней
        </span>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 glass-card rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div 
              key={booking.id}
              className="glass-card rounded-2xl p-5 shadow-glass flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border border-[#c3f400]/20 hover:border-[#c3f400]/50"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-['JetBrains_Mono'] text-[12px] font-bold text-[#c3f400]">{booking.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border font-['JetBrains_Mono'] ${booking.statusColor || 'bg-green-500/10 text-green-400 border-green-500/30'}`}>
                    {booking.status}
                  </span>
                </div>
                <h4 className="font-['Manrope'] font-bold text-[16px] text-white">{booking.guest}</h4>
                <p className="font-['Manrope'] text-[12px] text-[#a3a6a6] flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">event</span> {booking.dates}
                </p>
                <p className="font-['Manrope'] text-[12px] text-[#a3a6a6]">
                  {booking.object}
                </p>
              </div>

              <div className="text-right sm:self-center">
                <span className="font-['Manrope'] text-[20px] font-extrabold text-[#c3f400] tracking-tight">
                  {booking.amount}
                </span>
                <p className="font-['JetBrains_Mono'] text-[10px] text-green-400 font-bold">LIVE API VERIFIED</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
