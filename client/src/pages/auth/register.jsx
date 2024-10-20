import CommonForm from "@/components/common/form";
import { useState } from "react";
import { registerFormControls } from "@/config";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";

const initialState = {
  UserName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {toast} = useToast()

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if(data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate('/auth/login')
      } else {
        toast({
          title: data?.payload?.message,
          variant : 'destructive'
        });
      }
      });
  }
  
  console.log(formData);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new Account
        </h1>
        <p1 className="mt-2">
          Already Have Account
          <Link
            className="font-md ml-2 text-blue-800 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p1>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthRegister;
