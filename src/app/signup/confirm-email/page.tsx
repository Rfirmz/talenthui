export default function SignupConfirmEmailPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email ?? '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col  py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold text-2xl inline-block mb-4">
            Talent Hui
          </div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Confirm your email to continue
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We have sent a confirmation link to <b>{email}</b>.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Please check your inbox and click the link to verify your email address.
          </p>
        </div>
      </div>
    </div>
  );
}
