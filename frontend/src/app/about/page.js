import Link from "next/link";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black py-16 px-4">
      {/* Back to home button */}
      <Link
        href="/"
        className="mb-8 px-6 py-2 rounded-md bg-white text-black text-lg font-medium
        transition duration-300 ease-in-out transform hover:bg-gray-200 hover:scale-105 active:bg-gray-300
        active:scale-95"
      >
        Back to Home
      </Link>
      {/* Container for the main content */}
      <div className="prose prose-invert max-w-4xl w-full">
        {/* About Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">About</h1>
          <p>
            Welcome to the private NFT collection of{" "}
            <strong>hetrack.eth</strong>, a distinguished Blockchain enthusiast
            with a passion for innovation and digital artistry.
          </p>
          <p>
            This exclusive collection will soon feature{" "}
            <strong>10 unique NFTs</strong>, with the release date to be
            announced.
          </p>
          <p>
            Each NFT is meticulously crafted to reflect the vibrant and raw
            reality of French ghettos through striking and thought-provoking
            images. These digital artworks are not only visually compelling but
            also digitized and made ownable, offering a unique blend of artistic
            expression and blockchain technology.
          </p>
        </div>

        {/* Our Project Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Our Project</h2>
          <p>
            Our project is a collaborative effort involving multiple talented
            developers who are dedicated to bringing this vision to life. Each
            NFT in this collection is designed to capture the essence of the
            environment and convey powerful narratives through digital art.
          </p>
        </div>

        {/* Stay Tuned Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Stay Tuned</h2>
          <p>
            Stay tuned for updates on the release date and be prepared to
            explore and own a piece of this groundbreaking digital collection.
            Our commitment to quality and authenticity ensures that each NFT
            will be a valuable addition to your digital portfolio.
          </p>
        </div>

        {/* Thank You Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Thank You</h2>
          <p>
            Thank you for your interest and support in this innovative project.
            We look forward to sharing these exclusive NFTs with you soon!
          </p>
          <p>
            For any inquiries or further information, please feel free to reach
            out.
          </p>
          <p>
            <strong>hetrack.eth</strong>
            <br />
            <em>Blockchain Enthusiast</em>
          </p>
        </div>
      </div>
    </div>
  );
}
