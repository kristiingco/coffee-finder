import Head from "next/head";
import Image from "next/image";
import Banner from "../components/Banner";
import Card from "../components/Card";

import styles from "../styles/Home.module.css";

export default function Home() {
  const onClickHandler = () => {
    console.log("hi");
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Finder</title>
        <meta name="description" content="Find nearest coffee shops" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={"View stores nearby"}
          onClickHandler={onClickHandler}
        />
        <Image
          src="/static/hot_beverage.svg"
          alt="hero image"
          width={300}
          height={300}
        />
        <Card />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
