import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { fetchCoffeeStores } from "../../lib/coffee-stores";

import Head from "next/head";
import Image from "next/image";

import { StoreContext } from "../../store/store-context";

import { isEmpty } from "../../utils";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.fsq_id.toString() === params.id;
  });
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.fsq_id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}
const CoffeeStore = (initialProps) => {
  const router = useRouter();
  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore || {}
  );

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const createCoffeeStoreHandler = async (coffeeStore) => {
    try {
      const { fsq_id, name, votes, imgUrl, neighborhood, address } =
        coffeeStore;
      const response = await fetch("/api/create-coffee-store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fsq_id: fsq_id,
          name,
          votes: 0,
          imgUrl,
          neighborhood: neighborhood[0] || "",
          address: address || "",
        }),
      });

      const dbCoffeeStore = response.json();
    } catch (err) {
      console.error("error creating coffee store", err);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.fsq_id.toString() === id;
        });

        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          createCoffeeStoreHandler(coffeeStoreFromContext);
        }
      }
    } else {
      createCoffeeStoreHandler(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore]);

  const [voteCount, setVoteCount] = useState(0);

  const upvoteHandler = () => {
    let count = voteCount + 1;
    setVoteCount(count);
  };

  const { fsq_id, votes, name, address, neighborhood, imgUrl } = coffeeStore;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>{name ? name : "Coffee Store"}</title>
      </Head>
      <Link href="/">
        <a>Back to home</a>
      </Link>
      {address && <p>{address}</p>}
      {name && <p>{name}</p>}
      {neighborhood && <p>{neighborhood}</p>}
      <p>{voteCount}</p>
      <button onClick={upvoteHandler}>Upvote</button>
      <Image
        src={
          imgUrl ||
          "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
        }
        width={600}
        height={360}
        alt={name}
      />
    </div>
  );
};

export default CoffeeStore;
