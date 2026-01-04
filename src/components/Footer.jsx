import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} Smart Asset & Inventory Management System |
      Contact: <a href="mailto:bibinvsanthosh@gmail.com"> bibinvsanthosh@gmail.com</a>
    </footer>
  );
}

export default Footer;
