import { Popupbar } from "./PopupBar";

export const Header = () => {
  return (
    <div>
      <Popupbar />
      <header style={{padding:'20px'}}>
        <nav className="conventional-links">
          <ul>
            <li>
              <a href="https://www.sp2tx.com">SP2TX</a>
            </li>
            <li>
              <a href="https://www.sp2tx.com">Documentation</a>
            </li>
            <li>
              <a href="https://www.sp2tx.com">Tutorial</a>
            </li>
            <li>
              <a href="https://www.sp2tx.com">Example</a>
            </li>
            <li>
              <a href="https://www.sp2tx.com">FAQ</a>
            </li>
          </ul>
        </nav>
        <br />
        <h1>Alphafold2 Peptide Structure Prediction Server</h1>
        <br />
      </header>
    </div>
  );
};
