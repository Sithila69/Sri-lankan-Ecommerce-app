export const getBaseURL = (): string => {
  const isDev = process.env.NODE_ENV === "development";

  const localURL = process.env.NEXT_PUBLIC_LOCAL_BASE_URL;
  const prodURL = process.env.NEXT_PUBLIC_PROD_BASE_URL;

  if (!localURL || !prodURL) {
    console.error("localURL:", localURL);
    console.error("prodURL:", prodURL);
    throw new Error(
      "Missing LOCAL_BASE_URL or PROD_BASE_URL in environment variables"
    );
  }

  return isDev ? localURL : prodURL;
};
