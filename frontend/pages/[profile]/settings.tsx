import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import styled from "styled-components";
import { Setting } from "react-iconly";
import axios from "axios";
import { toast } from "react-toastify";
import Router from "next/router";
import Modal from "react-modal";
import { ProfileLayout, ProfilePageWithLayout } from "@/layout/profile/Layout";

Modal.setAppElement("#__next");

import { useAuth } from "@/src/context/auth";
import { usernameValidation, countries } from "@/src/tools";
import TwoFactor from "@/components/TwoFactor";
import DeleteAccount from "@/components/DeleteAccount";

type DataType = {
  username: string;
  email: string | null;
  fullName: string | null;
  country: string | null;
  phoneNumber: string | null;
  isTwoFactor: boolean;
};
const reset = {
  username: null,
  email: null,
  fullName: null,
  country: null,
  phoneNumber: null,
};

type ErrorType = {
  username?: string | null;
  email?: string | null;
  fullName?: string | null;
  country?: string | null;
  phoneNumber?: string | null;
};

const SettingsPage: ProfilePageWithLayout = ({ user }: { user: DataType }) => {
  const [error, setError] = useState<ErrorType>(reset);
  const [data, setData] = useState<DataType>(user);
  const { setUsername, user: me } = useAuth();

  useEffect(() => {
    setData(user);
  }, [user]);

  const post = async (value: string, field: string) => {
    await axios
      .put("/api/updates/settings", {
        value,
        field,
      })
      .then(() => {
        toast.success(field + " updated");
        setData((prev) => ({ ...prev, [field]: value }));
        setError((prev) => ({ ...prev, [field]: null }));
        if (field === "username") {
          setUsername(data?.username?.toLowerCase());
          Router.push("/" + value + "/settings");
        }
      })
      .catch((err) => {
        if (err.response.data.message === "Username already taken")
          setError((prev) => ({ ...prev, username: "Username already taken" }));
        else if (err.response.data.message === "Email already taken")
          setError((prev) => ({ ...prev, email: "Email already taken" }));
      });
  };

  const UpdateData = async (
    field: "username" | "email" | "fullName" | "country" | "phoneNumber",
    value: string
  ) => {
    let err = false;
    switch (field) {
      case "username":
        const validUsername = usernameValidation(value);
        if (validUsername !== "") {
          setError((prev) => ({ ...prev, username: validUsername }));
          err = true;
        }
        break;
      case "email":
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) {
          setError((prev) => ({ ...prev, email: "Invalid email" }));
          err = true;
        }
        break;
      case "fullName":
        const regexFullName = /^[a-zA-Z ]{2,30}$/;
        if (!regexFullName.test(value)) {
          setError((prev) => ({
            ...prev,
            fullName: "Invalid fullname",
          }));
          err = true;
        }
        break;
      case "phoneNumber":
        const regexPhone = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;
        if (!regexPhone.test(value)) {
          setError((prev) => ({
            ...prev,
            phoneNumber: "Invalid phone number",
          }));
          err = true;
        }
        break;
    }

    if (err) return;
    post(value, field);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(reset);
    if (!data || !me || !user) {
      if (data.username) Router.push("/" + data.username + "/settings");
      return;
    }
    // update any changes
    if (data.username.toLowerCase() !== me.username.toLowerCase())
      UpdateData("username", data.username.toLowerCase());
    if (data.email !== me.email && data.email !== null) UpdateData("email", data.email);
    if (data.fullName !== me.fullName && data.fullName !== null)
      UpdateData("fullName", data.fullName);
    if (data.country !== me.country && data.country !== null) UpdateData("country", data.country);
    if (data.phoneNumber !== me.phoneNumber && data.phoneNumber !== null)
      UpdateData("phoneNumber", data.phoneNumber);
  };

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: field, value } = e.target;
    if (field === "phone") {
      const regex = /^[0-9]*$/;
      if (!regex.test(value)) return;
      setData((prev) => ({ ...prev, phoneNumber: value.replace(/\D/g, "") }));
    } else if (field === "fullName") {
      const regex = /^[a-zA-Z ]*$/;
      if (!regex.test(value)) return;
      setData((prev) => ({ ...prev, fullName: value }));
    } else setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setData((prev) => ({ ...prev, country: e.target.value }));
  };

  return (
    <Style>
      <h1>
        <Setting set="bulk" />
        <span>Account Settings</span>
      </h1>
      <div className="fields">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor={data?.username}>Username *</label>
            <input
              className={error.username ? "error" : ""}
              type="text"
              name="username"
              value={data?.username}
              id={data?.username}
              placeholder="Enter a uniq username..."
              onChange={handleChanges}
            />
            {error.username && <p className="error">{error.username}</p>}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              value={data?.email || ""}
              id="email"
              name="email"
              placeholder="Enter a your address email"
              onChange={handleChanges}
              className={error.email ? "error" : ""}
            />
            {error.email && <p className="error">{error.email}</p>}
          </div>
          <div>
            <label htmlFor="full-name">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={data?.fullName || ""}
              id="full-name"
              placeholder="Enter a your name"
              onChange={handleChanges}
              className={error.fullName ? "error" : ""}
            />
            {error.fullName && <p className="error">{error.fullName}</p>}
          </div>
          <div>
            <label htmlFor="country">Country</label>
            <select
              name="country"
              id="country"
              onChange={handleCountry}
              defaultValue={data?.country || "DEFAULT"}
            >
              <option value="DEFAULT" disabled>
                Select your country
              </option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="phone-number">Phone</label>
            <input
              type="text"
              value={data?.phoneNumber || ""}
              id="phone-number"
              name="phone"
              placeholder="Enter a your phone number"
              onChange={handleChanges}
              className={error.phoneNumber ? "error" : ""}
            />
            {error.phoneNumber && <p className="error">{error.phoneNumber}</p>}
          </div>
          <div className="actions">
            <button type="submit">Save Changes</button>
          </div>
        </form>
        <div>
          <TwoFactor state={data?.isTwoFactor as boolean} />
          <DeleteAccount />
        </div>
      </div>
    </Style>
  );
};
export default SettingsPage;

const Style = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  .fields {
    display: flex;
    gap: 20px;
    > * {
      flex: 1;
    }
    form {
      padding-right: 20px;
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      > * {
        flex: unset;
      }
    }
  }
  .two-factor {
    margin-bottom: 30px;
    p {
      color: var(--text-200);
      margin-top: 10px;
    }
  }
  .actions {
    margin-top: 30px;
    margin-left: auto;
    display: flex;
    gap: 10px;
  }
`;

SettingsPage.getLayout = (page) => ProfileLayout(page, "Settings");

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { profile } = context.query;
  const { jwt } = context.req.cookies;
  let user = null;

  try {
    await axios
      .get(`${process.env.USERS}/getUser?username=${profile}`, {
        headers: {
          Cookie: `jwt=${jwt}`,
        },
      })
      .then((res) => {
        user = {
          username: res.data?.login,
          email: res.data?.email,
          fullName: res.data?.fullName,
          country: res.data?.country,
          phoneNumber: res.data?.phonenumber,
          isTwoFactor: res.data?.twofactor,
        };
      });
  } catch (e) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      user,
    },
  };
};
