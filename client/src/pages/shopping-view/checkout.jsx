import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import axios from "axios";

function ShoppingCheckOut() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const totalCartAmount = cartItems && cartItems.items && cartItems.items.length > 0
    ? cartItems.items.reduce(
        (sum, currentItem) =>
          sum + (currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) * currentItem?.quantity,
        0
      )
    : 0;

  function handleInitiateEsewaPayment() {
    const orderData = {
      userId: user?.id,
      cartItems: cartItems.items.map(singleCartItems => ({
        productId: singleCartItems.id,
        quantity: singleCartItems.quantity,
      })),
      addressInfo: {}, // Get address info from the Address component
      totalAmount: totalCartAmount,
    };

    axios.post("http://localhost:5000/api/shop/order/create", orderData)
      .then(response => {
        if (response.data.success) {
          window.location.href = response.data.approvalURL; // Redirect to eSewa payment gateway
        } else {
          console.error(response.data.message);
        }
      })
      .catch(error => {
        console.error("Error creating order:", error);
      });
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" alt="Account" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item.id} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total </span>
              <span className="font-bold">Rs {totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiateEsewaPayment} className="w-full">CheckOut with eSewa</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckOut;
