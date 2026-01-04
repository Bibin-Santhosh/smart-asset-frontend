function Table({ data }) {
  return (
    <table>
      {data.map((row, i) => (
        <tr key={i}>
          <td>{row.name}</td>
        </tr>
      ))}
    </table>
  );
}
export default Table;
