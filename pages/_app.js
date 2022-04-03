import "../styles/globals.css";
import styles from "../styles/Home.module.css";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
