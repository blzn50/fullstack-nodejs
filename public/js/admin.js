const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector('[name=productId]').value;
  const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value;

  const productElem = btn.closest('article');
  fetch('/admin/product/' + productId, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrfToken,
    },
  })
    .then((result) => result.json())
    .then((data) => {
      productElem.parentNode.removeChild(productElem);
      console.log(data);
    })
    .catch((err) => console.log(err));
};
