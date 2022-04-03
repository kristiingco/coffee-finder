import Image from "next/image";
import Link from "next/link";

const Card = ({ name, imageUrl, href }) => {
  return (
    <Link href={href}>
      <a>
        <h2>{name}</h2>
        <Image src={imageUrl} width={260} height={160} alt={name} />
      </a>
    </Link>
  );
};

export default Card;
