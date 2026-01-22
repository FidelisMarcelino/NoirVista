import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Register(){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit() = async(e: React.FormEvent) => {
        e.preventDefault();

        if(password !== confirmPassword){
            return setMessage("Password does not match");
        }

        setLoading(true)

        try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        location,
        email,
        createdAt: new Date(),
      });

      await signOut(auth); // tunggu sampai user benar-benar keluar

      setMessage("Sign Up Success!");
      navigate("/login", { replace: true }); // baru redirect
    } catch (err: any) {
      setMessage(err.message);
      setLoading(false);
    }
    }

    return(
        <>

        </>
    )
}