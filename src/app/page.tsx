export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Welcome to My App</h1>
      <div className="mt-6">
        <a href="/signUp" className="text-blue-500 hover:underline">Sign Up</a>
        <span className="mx-2">|</span>
        <a href="/login" className="text-blue-500 hover:underline">Login</a>
      </div>
    </div>
  );
}
