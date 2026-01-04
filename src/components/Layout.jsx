import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <>
      <Header />

      <div style={{ display: "flex", minHeight: "calc(100vh - 120px)" }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "24px", background: "#f1f5f9" }}>
          {children}
        </main>
      </div>

      <Footer />
    </>
  );
}

export default Layout;
