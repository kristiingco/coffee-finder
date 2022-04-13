import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  const { fsq_id, name, neighborhood, address, imgUrl, votes } = req.body;

  try {
    if (fsq_id) {
      if (req.method === "POST") {
        const records = await findRecordByFilter(fsq_id);
        if (records.length !== 0) {
          res.json(records);
        } else {
          if (name) {
            const createdRecords = await table.create([
              {
                fields: {
                  fsq_id,
                  name,
                  address,
                  neighborhood,
                  votes,
                  imgUrl,
                },
              },
            ]);

            const records = getMinifiedRecords(createdRecords);
            res.json(records);
          } else {
            res.status(400);
            res.json({ message: "id or name is missing" });
          }
        }
      }
    } else {
      res.status(400);
      res.json({ message: "fsq_id is missing" });
    }
  } catch (err) {
    console.error("Error creating or finding store", err);
    res.status(500);
    res.json({ message: "Error creating or finding store", err });
  }
};

export default createCoffeeStore;
