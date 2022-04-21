import Image from "next/image";
import Link from "next/link";

const Card = ({ name, imageUrl, href }) => {
  return (
    <div className="p-3 m-3 border rounded-md">
      <Link href={href}>
        <a>
          <Image
            src={imageUrl}
            width={260}
            height={160}
            layout="responsive"
            alt={name}
          />
          <h3 className="font-semibold mt-3">{name}</h3>
        </a>
      </Link>
    </div>
  );
};

export default Card;
