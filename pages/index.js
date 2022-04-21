import { useState, useEffect, useContext } from "react";
import { useTrackLocation } from "../hooks/use-track-location";
import Head from "next/head";
import Banner from "../components/Banner";
import Card from "../components/Card";

import { fetchCoffeeStores } from "../lib/coffee-stores";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores,
    },
  };
}

export default function Home(props) {
  const { trackLocationHandler, locationErrorMessage, isFindingLocation } =
    useTrackLocation();

  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);

  const { latLong, coffeeStores } = state;

  useEffect(() => {
    async function getMoreCoffeeStores() {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/get-coffee-stores-by-location?latLong=${latLong}&limit=30`
          );
          const coffeeStores = await response.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores },
          });
          setCoffeeStoresError("");
        } catch (error) {
          setCoffeeStoresError(error.message);
        }
      }
    }

    getMoreCoffeeStores();
  }, [latLong, dispatch]);

  const onClickHandler = () => {
    trackLocationHandler();
    console.log({ latLong, locationErrorMessage });
  };

  return (
    <div className="font-Poppins">
      <Head>
        <title>Coffee Finder</title>
        <meta name="description" content="Find nearest coffee shops" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          onClickHandler={onClickHandler}
        />
        {locationErrorMessage && (
          <div> Something went wrong: {locationErrorMessage}</div>
        )}
        {coffeeStoresError && (
          <div> Something went wrong: {coffeeStoresError}</div>
        )}
        {coffeeStores.length > 0 && (
          <div>
            <h2 className="text-xl text-center">Coffee Stores Near You</h2>
            <div className="grid place-content-center  min-w-0 min-h-0 md:grid-cols-3 ">
              {coffeeStores.map(({ fsq_id, name, imgUrl }) => {
                return (
                  <Card
                    key={fsq_id}
                    name={name}
                    imageUrl={
                      imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffee-store/${fsq_id}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div>
            <h2 className="text-xl text-center">San Francisco Coffee Stores</h2>
            <div className="grid place-content-center md:grid-cols-3 md:grid-rows-3">
              {props.coffeeStores.map(({ fsq_id, name, imgUrl }) => {
                return (
                  <Card
                    key={fsq_id}
                    name={name}
                    imageUrl={
                      imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffee-store/${fsq_id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
