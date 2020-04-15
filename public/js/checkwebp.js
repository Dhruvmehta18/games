// eslint-disable-next-line no-unused-vars
const testWebP = () => {
  const canvas = typeof document === 'object'
    ? document.createElement('canvas') : {};
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL ? canvas.toDataURL('image/webp').indexOf('image/webp') === 5 : false;
};
