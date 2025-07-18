import React from 'react';
import { Calendar } from 'lucide-react';

const BookingForm = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Calendar className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Service</h1>
          <p className="text-gray-600">Booking form is under development.</p>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;