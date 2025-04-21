const RoomCodeInput = ({ value, onChange }) => {
    return (
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Room Code"
        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  };
  
  export default RoomCodeInput;
  