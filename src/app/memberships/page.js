'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function AddMembership() {
  const [formDataOneMonth, setFormDataOneMonth] = useState({
    membershipType: 'Premium - 1 Month',
    startDate: '',
    endDate: '',
    renew: false,
  });

  const [formDataOneYear, setFormDataOneYear] = useState({
    membershipType: 'Premium - 1 Year',
    startDate: '',
    endDate: '',
    renew: false,
  });

  useEffect(() => {
    const today = new Date();
    const startDate = today.toISOString().split('T')[0]; // Format yyyy-mm-dd

    // One Month End Date
    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1); // Add 1 month
    const formattedOneMonthEndDate = oneMonthLater.toISOString().split('T')[0];

    // One Year End Date
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1); // Add 1 year
    const formattedOneYearEndDate = oneYearLater.toISOString().split('T')[0];

    // Set both plans
    setFormDataOneMonth({
      ...formDataOneMonth,
      startDate: startDate,
      endDate: formattedOneMonthEndDate,
    });

    setFormDataOneYear({
      ...formDataOneYear,
      startDate: startDate,
      endDate: formattedOneYearEndDate,
    });
  }, []);

  const handleChangeOneMonth = (e) => {
    const { checked } = e.target;
    setFormDataOneMonth({
      ...formDataOneMonth,
      renew: checked,
    });
  };

  const handleChangeOneYear = (e) => {
    const { checked } = e.target;
    setFormDataOneYear({
      ...formDataOneYear,
      renew: checked,
    });
  };

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    const token = Cookies.get('authToken'); // Get auth token

    const payload = {
      user_id: 1, // Example user ID, replace it with dynamic user logic
      membership_type: formData.membershipType,
      start_date: formData.startDate,
      end_date: formData.endDate,
      renew: formData.renew,
    };

    try {
      const res = await fetch('https://devsalman.tech/add-membership', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Membership added successfully!');
      } else {
        alert('Error adding membership: ' + result.message);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error submitting form');
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8 grid grid-cols-1 gap-6">
      {/* One Month Subscription Card */}
      <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Premium Membership - 1 Month</h2>
        <p className="text-gray-600 mb-6">Plan: {formDataOneMonth.membershipType}</p>
        <div className="text-gray-900 font-semibold text-3xl mb-2">$9.99</div>
        <p className="text-gray-600 mb-6">per month</p>
        <p className="text-gray-600 mb-4">Membership starts: {formDataOneMonth.startDate}</p>
        <p className="text-gray-600 mb-4">Membership ends: {formDataOneMonth.endDate}</p>

        <form onSubmit={(e) => handleSubmit(e, formDataOneMonth)}>
          <input type="hidden" name="membershipType" value={formDataOneMonth.membershipType} />
          <input type="hidden" name="startDate" value={formDataOneMonth.startDate} />
          <input type="hidden" name="endDate" value={formDataOneMonth.endDate} />

          <div className="flex items-center justify-center mb-4">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                name="renew"
                checked={formDataOneMonth.renew}
                onChange={handleChangeOneMonth}
                className="mr-2"
              />
              Auto Renew
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>

      {/* One Year Subscription Card */}
      <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Premium Membership - 1 Year</h2>
        <p className="text-gray-600 mb-6">Plan: {formDataOneYear.membershipType}</p>
        <div className="text-gray-900 font-semibold text-3xl mb-2">$99.99</div>
        <p className="text-gray-600 mb-6">per year</p>
        <p className="text-gray-600 mb-4">Membership starts: {formDataOneYear.startDate}</p>
        <p className="text-gray-600 mb-4">Membership ends: {formDataOneYear.endDate}</p>

        <form onSubmit={(e) => handleSubmit(e, formDataOneYear)}>
          <input type="hidden" name="membershipType" value={formDataOneYear.membershipType} />
          <input type="hidden" name="startDate" value={formDataOneYear.startDate} />
          <input type="hidden" name="endDate" value={formDataOneYear.endDate} />

          <div className="flex items-center justify-center mb-4">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                name="renew"
                checked={formDataOneYear.renew}
                onChange={handleChangeOneYear}
                className="mr-2"
              />
              Auto Renew
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
