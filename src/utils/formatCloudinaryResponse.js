const formatCloudinaryResponse = (res) => {
  const result = {
    url: res.url,
    public_id: res.public_id,
  };
  return result;
};
export { formatCloudinaryResponse };
