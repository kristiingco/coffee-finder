import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";

import { fetchCoffeeStores } from "../../lib/coffee-stores";

import Head from "next/head";
import Image from "next/image";

import { StoreContext } from "../../store/store-context";
import { ThumbUpIcon, ArrowLeftIcon } from "@heroicons/react/solid";

import { isEmpty, fetcher } from "../../utils";

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

  const { data, error } = useSWR(
    `/api/get-coffee-store-by-id?id=${id}`,
    fetcher
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);

      setVoteCount(data[0].votes);
    }
  }, [data]);

  const upvoteHandler = async () => {
    try {
      const response = await fetch("/api/upvote-coffee-store-by-id", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fsq_id: id,
        }),
      });

      const dbCoffeeStore = response.json();
      let count = voteCount + 1;
      setVoteCount(count);
    } catch (err) {
      console.error("error upvoting coffee store", err);
    }
  };

  if (error) {
    return <div>Something went wrong</div>;
  }

  const { fsq_id, votes, name, address, neighborhood, imgUrl } = coffeeStore;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="m-5">
      <Head>
        <title>{name ? name : "Coffee Store"}</title>
      </Head>

      <Link href="/">
        <a className="flex items-center gap-2 h-2 m-3 text-sm">
          <ArrowLeftIcon className="h-5 w-5" />
          Back to home
        </a>
      </Link>
      <div className="flex flex-col p-3 m-5 border md:flex-row md:w-3/4 mx-auto">
        <Image
          src={
            imgUrl ||
            "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
          }
          width={600}
          height={360}
          alt={name}
        />
        <div className="flex flex-col md:w-1/2 md:p-5 md:justify-between">
          <div className="flex flex-col">
            {name && (
              <h1 className="font-semibold text-xl md:text-3xl">{name}</h1>
            )}
            {address && <p className="md:text-lg">{address}</p>}
            {neighborhood && <p className="md:text-lg">{neighborhood}</p>}
          </div>
          <div className="mt-8 h-auto flex justify-end">
            <p className="mr-4 text-lg text-cool-purple font-semibold">
              {voteCount}
            </p>
            <button
              className="bg-cool-purple text-white px-4 py-1 rounded-lg flex gap-2 items-center"
              onClick={upvoteHandler}
            >
              <ThumbUpIcon className="h-5 w-5" />
              Upvote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
