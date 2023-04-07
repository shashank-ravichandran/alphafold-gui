const data = require('./Utils/1jug.pdb')

export const Test = () => {
    console.log(data);
  return (
    <div
      style={{height: '70vh', width: '50vw', position: 'absolute', display: 'flex', left:'25%'}}
      className="viewer_3Dmoljs"
      data-href={data}
      data-backgroundcolor="0xffffff"
      data-style="cartoon"
      data-ui="true"
    />
  );
};
