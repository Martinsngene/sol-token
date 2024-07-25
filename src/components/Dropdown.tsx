const Dropdown = () => {
  return (
    <select
      className="rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#55c8ed] sm:text-[1rem] sm:leading-6"
      name="network"
      id="network"
    >
      <option value="https://api.mainnet-beta.solana.com">Mainnet Beta</option>
      <option value="https://api.testnet.solana.com">Testnet</option>
      <option value="https://api.devnet.solana.com">Devnet</option>
      <option value="http://127.0.0.1:8899">LocalHost</option>
    </select>
  );
};

export default Dropdown;
