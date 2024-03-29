import {
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";

import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { db, storage } from "@/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export default function AccountingTweet() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      text: input,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
      name: session.user.name,
      username: session.user.username,
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      //If there is a link created in  SelectedFile(readerEvent.target.result);
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setInput("");
    setSelectedFile(null);
    setLoading(false);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  return (
    <>
      {session && (
        <div className="flex border-b border-blue-200 p-3 space-x-3">
          <img
            src={session.user.image}
            alt="user-img"
            className="h-11 w-11 rounded-full cursor-pointer hover:brightness-90"
          />

          <div className="w-full divide-y divide-gray-200">
            <div className="">
              <textarea
                className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px]  text-gray-700"
                rows="2"
                placeholder="jot down here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div>
            {selectedFile && (
              <div className="relative">
                <XIcon
                  onClick={() => setSelectedFile(null)}
                  className="border-white m-1 h-7 text-white absolute cursor-pointer rounded-full"
                />
                <img
                  src={selectedFile}
                  className={`${loading && "animate-pulse"}`}
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2.5">
              {!loading && (
                <>
                  <div className="flex">
                    <div
                      className=""
                      onClick={() => filePickerRef.current.click()}
                    >
                      <PhotographIcon className="h-10 w-10 hoverEffect p-2 text-yellow-500 hover:bg-yellow-100" />
                      <input
                        type="file"
                        hidden
                        ref={filePickerRef}
                        onChange={addImageToPost}
                      />
                    </div>
                    <EmojiHappyIcon className="h-10 w-10 hoverEffect p-2 text-yellow-500 hover:bg-yellow-100" />
                    <AccountBalanceOutlinedIcon className="  pt-1 hoverEffect text-sky-500 hover:bg-sky-100" />

                    <AccountTreeOutlinedIcon
                      disableElevation
                      className="hoverEffect text-sky-500 hover:bg-sky-100 pt-0.1 pt-1"
                      variant="contained"
                    />
                  </div>
                  <button
                    onClick={sendPost}
                    disabled={!input.trim()}
                    className="bg-yellow-100 text-blue px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                  >
                    Scribble
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
