import { useActions, useAppDispatch } from "utils/redux-utils";
import { authActions } from "features/Auth/index";
import { FormikHelpers, useFormik } from "formik";
import { LoginParamsType, ResponseType } from "api/types";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "features/Auth/selectors";

type FormikErrorType = Partial<Omit<LoginParamsType, "captcha">>

export const useLogin = () => {
  const { login } = useActions(authActions);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\/[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 3) {
        errors.password = "Must be 3 characters or more";
      }
      return errors;
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false
    },
    onSubmit: (values: LoginParamsType, formikHelpers: FormikHelpers<LoginParamsType>) => {
      dispatch(login(values))
        .unwrap()
        .catch((err: ResponseType) => {
          err.fieldsErrors?.forEach((fieldError) => {
            formikHelpers.setFieldError(fieldError.field, fieldError.error);
          });
        });
    }
  });

  return {formik, isLoggedIn}
};