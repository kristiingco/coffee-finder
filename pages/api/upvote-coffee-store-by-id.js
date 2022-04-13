import {
  table,
  findRecordByFilter,
  getMinifiedRecords,
} from "../../lib/airtable";

const upvoteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { fsq_id } = req.body;
      if (fsq_id) {
        const records = await findRecordByFilter(fsq_id);
        if (records.length !== 0) {
          const record = records[0];

          const calculateVoting = parseInt(record.votes) + parseInt(1);

          const updateRecord = await table.update([
            {
              id: record.record_id,
              fields: {
                votes: calculateVoting,
              },
            },
          ]);

          if (updateRecord) {
            const minifiedRecord = getMinifiedRecords(updateRecord);
            res.json(minifiedRecord);
          }
        } else {
          res.json({ message: "Coffee store w/ id does not exist", fsq_id });
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing" });
      }
    } catch {
      res.status(500);
      res.json({ message: "Error upvoting coffee store", error });
    }
  }
};

export default upvoteCoffeeStoreById;
