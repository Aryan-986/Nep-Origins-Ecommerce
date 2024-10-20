import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/product-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

// Image imports for banners
import bannerOne from "../../assets/bannertwo.png";
import bannerTwo from "../../assets/Men Banner.png";
import bannerThree from "../../assets/Banner 1.jpg";

// Image imports for categories
import menImage from "../../assets/mencategory.png";
import womenImage from "../../assets/womencategory.png";
import kidsImage from "../../assets/kids category.png";
import accessoriesImage from "../../assets/accessoriescategory.png";
import footwearImage from "../../assets/footwearscategory.png";

// Image imports for brands
import nikeImage from "../../assets/nikebrand.jpg";
import adidasImage from "../../assets/adidasbrand.png";
import pumaImage from "../../assets/pumabrand.png";
import leviImage from "../../assets/levibrand.png";
import zaraImage from "../../assets/zarabrand.png";
import hmImage from "../../assets/hmbrand.png";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

const categoriesWithImage = [
  { id: "men", label: "Men", image: menImage },
  { id: "women", label: "Women", image: womenImage },
  { id: "kids", label: "Kids", image: kidsImage },
  { id: "accessories", label: "Accessories", image: accessoriesImage },
  { id: "footwear", label: "Footwear", image: footwearImage },
];

const brandsWithImage = [
  { id: "nike", label: "Nike", image: nikeImage },
  { id: "adidas", label: "Adidas", image: adidasImage },
  { id: "puma", label: "Puma", image: pumaImage },
  { id: "levi", label: "Levi's", image: leviImage },
  { id: "zara", label: "Zara", image: zaraImage },
  { id: "h&m", label: "H&M", image: hmImage },
];

// Custom hook for fetching products
const useFetchProducts = () => {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const [OpenDetailsDialog, setOpenDetailsDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }));
  }, [dispatch]);

  return { productList, productDetails };
};

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList = [], productDetails } = useFetchProducts(); // Defaulting to an empty array if productList is undefined
  const user = useSelector((state) => state.auth.user); // Accessing user from the state
  const [OpenDetailsDialog, setOpenDetailsDialog] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const slides = [bannerOne, bannerTwo, bannerThree];

  function handleNavigateToListingPage(getCurrentItem, section) {
    // Clear existing filters and set new one for the selected category
    sessionStorage.removeItem('filters');
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem('filters', JSON.stringify(currentFilter));
    navigate(`shop/listing`); // Ensure the route is correctly defined in your router
  }

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);

    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner section */}
      <div className="relative w-full h-[600px] sm:h-[400px] md:h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            className={`${index === currentSlide ? "opacity-100" : "opacity-0"
              } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            alt={`Banner for slide ${index + 1}`}
          />
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Shop By Category */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-8"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontStyle: "italic",
            }}
          >
            Shop By Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithImage.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6 h-[180px]">
                  <img
                    src={categoryItem.image}
                    alt={`Shop for ${categoryItem.label}`}
                    className="w-full h-full object-cover" // Ensures the image covers the entire box
                  />
                  <span className="font-bold mt-2">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shop By Brands */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-8"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontStyle: "italic",
            }}
          >
            Shop By Brands
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithImage.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <img
                    src={brandItem.image}
                    alt={`${brandItem.label} brand`}
                    width={80}
                    height={80}
                  />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-8"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontStyle: "italic",
            }}
          >
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.length > 0 ? (
              productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            ) : (
              <p className="text-center col-span-full">
                No products available.
              </p>
            )}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={OpenDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
