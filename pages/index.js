import Head from "next/head";
import Image from "next/image";
import Banner from "../components/Banner";
import Card from "../components/Card";

import styles from "../styles/Home.module.css";

import coffeeStoresData from "../data/coffee-stores.json";

export async function getStaticProps(context) {
  return {
    props: {
      coffeeStores: coffeeStoresData,
    },
  };
}

export default function Home(props) {
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

        {props.coffeeStores.length > 0 && (
          <div>
            <h2>San Francisco Coffee Stores</h2>
            {props.coffeeStores.map(({ id, name, imgUrl }) => {
              return (
                <Card
                  key={id}
                  name={name}
                  imageUrl={imgUrl}
                  href={`/coffee-store/${id}`}
                />
              );
            })}
          </div>
        )}
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
