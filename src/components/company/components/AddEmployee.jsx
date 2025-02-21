import React from "react";

const AddEmployee = ({ closeModal }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-md shadow-lg w-1/3">
        <h2 className="text-2xl mb-4">Yeni Üye Formu</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-2">Ad</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">E-posta</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-colorFirst text-primary border border-borderColor rounded-md"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-colorSecond text-primary border-borderColor rounded-md mr-2"
            >
              Kapat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
