import Link from "next/link";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black py-16 px-4">
      {/* Back to home button */}
      <Link
        href="/"
        className="mb-8 px-6 py-2 rounded-md bg-white text-black text-lg font-medium
        transition duration-300 ease-in-out transform hover:bg-gray-200 hover:scale-105 active:bg-gray-300
        active:scale-95 md:text-xl lg:text-3xl"
      >
        Back to Home
      </Link>
      {/* Container for the main content */}
      <div className="prose prose-invert max-w-4xl w-full">
        {/* About Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 md:text-4xl lg:text-5xl">
            About
          </h1>
          <p className="text-base md:text-lg lg:text-xl">
            Welcome to the private NFT collection of{" "}
            <strong>apojean.eth</strong>, a humble Blockchain learner at the
            beginning of his journey, with a passion for innovation and digital
            artistry.
          </p>
          <p className="text-base md:text-lg lg:text-xl">
            This collection currently features <strong>10 unique NFTs</strong>,
            released on the Sepolia testnet.
          </p>
          <p className="text-base md:text-lg lg:text-xl">
            Each NFT is crafted to reflect the fun rabbits. These digital
            artworks are not only visually compelling but also digitized and
            made ownable, offering a unique blend of artistic expression and
            blockchain technology.
          </p>
        </div>

        {/* Project Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 md:text-3xl lg:text-4xl">
            Project
          </h2>
          <p className="text-base md:text-lg lg:text-xl">
            Project is a first of all a learning effort to understand the
            Blockchain technology and its potential applications. The project is
            aimed at providing a public repository of NFTs marketplace app for
            the community to explore and collect.
          </p>
        </div>

        {/* Thank You Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 md:text-3xl lg:text-4xl">
            Thank You
          </h2>
          <p className="text-base md:text-lg lg:text-xl">
            Thank you for your interest and support in this innovative project.
            We look forward to sharing these exclusive NFTs with you!
          </p>
          <p className="text-base md:text-lg lg:text-xl">
            For any inquiries or further information, please feel free to reach
            out.
          </p>
          <p className="text-base md:text-lg lg:text-xl">
            <strong>apojean.eth</strong>
            <br />
            <em>A Blockchain Learner</em>
          </p>
        </div>
      </div>
    </div>
  );
}
