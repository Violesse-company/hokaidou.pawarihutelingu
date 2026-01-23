import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
  getFirestore, collection, query, orderBy, onSnapshot, addDoc, doc, getDoc, setDoc 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// -------------------
// Firebase 初期化
// -------------------
const firebaseConfig = {
  apiKey: "AIzaSyDit7SzdLp98qR5daIpe_wzp_EvYxh6OKU",
  authDomain: "holtukaidoupawa-rihutelingu.firebaseapp.com",
  projectId: "holtukaidoupawa-rihutelingu",
  storageBucket: "holtukaidoupawa-rihutelingu.firebasestorage.app",
  messagingSenderId: "584745357094",
  appId: "1:584745357094:web:52dc1a32ba13597c3cbbe7"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// -------------------
// DOM 要素
// -------------------
const chatDiv = document.getElementById("chat");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const toggleBtn = document.getElementById('toggleTheme');
const hamburger = document.getElementById('hamburgerMenu');
const navMenu = document.getElementById('navMenu');

const chatRef = collection(db, "chat");
const chatQuery = query(chatRef, orderBy("timestamp", "asc"));
const commentControlRef = doc(db, "appSettings", "commentControl");
const nextLiveRef = doc(db, "appSettings", "nextLive");
const nextLiveCommentRef = doc(db, "chat", "nextLiveComment");

let countdownInterval = null;

// -------------------
// コメント制御監視
// -------------------
onSnapshot(commentControlRef, snap => {
  const disabled = snap.exists() ? snap.data().disabled : false;
  messageInput.disabled = sendBtn.disabled = disabled;
});

// -------------------
// リアルタイムチャット表示（ピン留め下部固定）
// -------------------
onSnapshot(chatQuery, snapshot => {
  chatDiv.innerHTML = "";

  const pinnedComments = [];
  const normalComments = [];

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const item = { id: docSnap.id, data };
    if (data.pinned) pinnedComments.push(item);
    else normalComments.push(item);
  });

  const renderComment = (item) => {
    const data = item.data;
    const div = document.createElement("div");
    div.style.padding = "5px 8px";
    div.style.borderRadius = "4px";
    div.style.margin = "3px 0";
    div.style.backgroundColor = data.user === "配信運営者" ? "#1565c0" : "#f0f0f0";
    div.style.color = data.user === "配信運営者" ? "white" : "black";

    div.innerHTML = `<strong>${data.user ?? "匿名"}</strong>: ${data.message ?? "(内容なし)"}<br>
                     <small>${data.timestamp?.toDate?.().toLocaleString?.() ?? ""}</small>`;

    // ピン留め/解除ボタン
    if (data.user !== "配信運営者") {
      const pinBtn = document.createElement("button");
      pinBtn.onclick = async () => {
        await setDoc(doc(db, "chat", item.id), { pinned: !data.pinned }, { merge: true });
      };

    }

    // 削除ボタン
    const delBtn = document.createElement("button");
    delBtn.onclick = async () => { await deleteDoc(doc(db, "chat", item.id)); };


    return div;
  };

  // 通常コメントを先に追加
  normalComments.forEach(item => chatDiv.appendChild(renderComment(item)));
  // ピン留めコメントを下部に追加
  pinnedComments.forEach(item => chatDiv.appendChild(renderComment(item)));

  chatDiv.scrollTop = chatDiv.scrollHeight;
});


// -------------------
// ユーザー送信
// -------------------
async function sendMessage() {
  const flagSnap = await getDoc(commentControlRef);
  if (flagSnap.exists() && flagSnap.data().disabled) {
    alert("現在、コメントは無効化されています");
    return;
  }

  const message = messageInput.value.trim();
  if (!message) return;

  try {
    await addDoc(chatRef, {
      user: "パワーリフティングのファン",
      message,
      timestamp: new Date()
    });
    messageInput.value = "";
  } catch (error) {
    console.error("送信エラー:", error);
  }
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", e => {
  if (e.key === "Enter") { e.preventDefault(); sendMessage(); }
});

// -------------------
// 運営メッセージ送信関数
// -------------------
export async function sendAdminMessage(message) {
  if (!message) return;
  try {
    await addDoc(chatRef, {
      user: "配信運営者",
      message,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("運営送信エラー:", error);
  }
}

// -------------------
// ライブ切替
// -------------------
function setLiveUrl(liveId) {
  document.getElementById('youtubeLive').src = `https://www.youtube.com/embed/${liveId}?autoplay=1`;
}

// -------------------
// ハンバーガーメニュー切替
// -------------------
hamburger.addEventListener('click', () => {
  navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

// -------------------
// ダークモード切替
// -------------------
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  toggleBtn.textContent = document.body.classList.contains('dark-mode') ? "デフォルトに戻す" : "ダークモード";
});

function shareTwitter() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent("北海道パワーリフティングライブ配信はこちら!");
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
}

function shareLine() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://social-plugins.line.me/lineit/share?url=${url}`, "_blank");
}

function shareFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
}
