
// ======================================================
// PaperTCG-UI-Kit Ver0.1
// 対象指定コア
// ======================================================


// ======================================================
// 基本状態
// ======================================================
import {
    Input,
    BlobSource,
    ALL_FORMATS
} from "https://cdn.jsdelivr.net/npm/mediabunny/+esm";
let currentPlayer = "self";


let selfNumberCounter = 1;
let opponentNumberCounter = 1;

let markers = [];

let relations = [];

let selectedMarkers = [];


// ======================================================
// HTML要素
// ======================================================

const statusDisplay =
    document.getElementById("status");

const currentPlayerDisplay =
    document.getElementById("current-player");

const playerSelfButton =
    document.getElementById("player-self");

const playerOpponentButton =
    document.getElementById("player-opponent");

const targetButton =
    document.getElementById("target-button");

const eraserButton =
    document.getElementById("eraser-button");

const resetNumberButton =
    document.getElementById("reset-number-button");

const fields =
    document.querySelectorAll(".field");


// ==========================
// 動画テスト
// ==========================

const videoFile = document.getElementById("video-file");

const video = document.getElementById("video-preview");

// 原本動画
const originalVideo = document.createElement("video");

originalVideo.muted = true;
originalVideo.playsInline = true;
originalVideo.preload = "auto";

const currentTimeDisplay =
    document.getElementById("current-time");

const videoOverlay =
    document.getElementById("video-overlay");
const exportVideoButton =
    document.getElementById("export-video");
exportVideoButton.addEventListener("click", () => {
    console.log("動画書き出しは一旦停止しています。");
});
document.addEventListener("DOMContentLoaded", () => {

    const videoFile =
        document.getElementById("video-file");

videoFile.addEventListener("change", async event => {

    const file = videoFile.files[0];

const input = new Input({
    formats: ALL_FORMATS,
    source: new BlobSource(file)
});

const duration = await input.computeDuration();

console.log("Mediabunny duration:", duration);

    if (!file) {
        return;
    }

   const url = URL.createObjectURL(file);

originalVideo.src = url;
originalVideo.load();

video.src = url;
video.load();
});

    const video =
        document.getElementById("video-preview");

    const currentTimeDisplay =
        document.getElementById("current-time");

    const videoOverlay =
        document.getElementById("video-overlay");

    if (videoOverlay) {
    console.log("video-overlay を取得しました");
}

 video.addEventListener("timeupdate", () => {

    const currentTime = video.currentTime;

    console.log("現在時刻:", currentTime);

if (currentTimeDisplay) {

    currentTimeDisplay.textContent =
        `${video.currentTime.toFixed(2)}秒`;
editHistory.forEach(history => {

    if (history.markerId === null) {
        return;
    }

    const marker =
        markers.find(marker =>
            marker.id === history.markerId
        );

    if (!marker || !history.overlayElement) {
        return;
    }

 const startTime = history.time;
const endTime = history.time + history.duration;

    if (
        currentTime >= startTime &&
        currentTime <= endTime
    ) {
        history.overlayElement.style.color = "white";
    } else {
        history.overlayElement.style.color = "transparent";
     }

});
   }

});
    
// ======================================================
// 自分 / 相手 切替
// ======================================================

playerSelfButton.addEventListener("click", () => {

    currentPlayer = "self";

    updatePlayerDisplay();

});


playerOpponentButton.addEventListener("click", () => {

    currentPlayer = "opponent";

    updatePlayerDisplay();

});


function updatePlayerDisplay() {

    if (currentPlayer === "self") {

        currentPlayerDisplay.textContent = "自分";

        playerSelfButton.classList.add("active");

        playerOpponentButton.classList.remove("active");

    } else {

        currentPlayerDisplay.textContent = "相手";

        playerOpponentButton.classList.add("active");

        playerSelfButton.classList.remove("active");

    }

}


// ======================================================
// カード指定
// ======================================================

fields.forEach(field => {

    field.addEventListener("click", event => {

console.log(
    "カード指定クリック:",
    currentPlayer,
    "次の番号:",
    currentPlayer === "self"
        ? selfNumberCounter
        : opponentNumberCounter
);

        // クリック位置
        const rect =
            field.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

console.log("座標基準:", {
    markerX: x,
    markerY: y,
    fieldWidth: field.clientWidth,
    fieldHeight: field.clientHeight,
    videoWidth: video.videoWidth,
    videoHeight: video.videoHeight
});


        // マーカーを作成
const markerNumber =
    currentPlayer === "self"
        ? selfNumberCounter
        : opponentNumberCounter;

const marker = {
    id: Date.now(),
    number: markerNumber,
    player: currentPlayer,
    field: field,
    x: x,
    y: y
};


        markers.push(marker);

        // 番号を表示
        createMarkerElement(marker);


// 次の番号へ
if (currentPlayer === "self") {

    selfNumberCounter++;

} else {

    opponentNumberCounter++;

}

statusDisplay.textContent =
    `${currentPlayer === "self" ? "自分" : "相手"} ${marker.number} を指定しました。`;
    });

});


// ======================================================
// マーカー表示
// ======================================================

function createMarkerElement(marker) {

    const element =
        document.createElement("div");

    element.className =
        "card-marker";

    element.dataset.id =
        marker.id;

    element.textContent =
        marker.number;


    element.style.left =
        marker.x + "px";

    element.style.top =
        marker.y + "px";


    marker.element =
        element;


    marker.field.appendChild(element);

console.log(
    "マーカー表示状態:",
    marker.number,
    getComputedStyle(element).display,
    getComputedStyle(element).visibility,
    getComputedStyle(element).opacity,
    element.getBoundingClientRect()
);

    // マーカーをクリック
 element.addEventListener("click", event => {

    event.stopPropagation();

    selectMarker(marker);

});
element.addEventListener("mousedown", event => {

    event.stopPropagation();

    const rect = marker.field.getBoundingClientRect();

    const offsetX = event.clientX - rect.left - marker.x;
    const offsetY = event.clientY - rect.top - marker.y;

    function move(event) {

        marker.x =
            event.clientX - rect.left - offsetX;

        marker.y =
            event.clientY - rect.top - offsetY;

        element.style.left =
            marker.x + "px";

        element.style.top =
            marker.y + "px";
    }

    function stop() {

        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", stop);

    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);

});

}


// ======================================================
// マーカー選択
// ======================================================

function selectMarker(marker) {

    console.log("selectMarker実行:", marker);

    if (selectedMarkers.includes(marker)) {

        selectedMarkers =
            selectedMarkers.filter(
                item => item !== marker
            );


        marker.element.classList.remove(
            "selected"
        );

  } else {

    selectedMarkers.push(marker);

    console.log("selectedMarkersに追加後:", selectedMarkers);

    marker.element.classList.add("selected");
}


    statusDisplay.textContent =
        `選択中：${selectedMarkers.length}個`;

console.log("selectMarker終了時:", selectedMarkers);

}
// ======================================================
// 対象
// ======================================================

targetButton.addEventListener("click", () => {

    if (selectedMarkers.length !== 2) {

        statusDisplay.textContent =
            "対象にはカードを2つ選択してください。";

        return;

    }


    const from =
        selectedMarkers[0];

    const to =
        selectedMarkers[1];


    const relation = {

        id: Date.now(),

        from: from,

        to: to,

        type: "target"

    };


    relations.push(relation);


    createArrow(relation);


    // 選択解除
    selectedMarkers.forEach(marker => {

        marker.element.classList.remove(
            "selected"
        );

    });

    selectedMarkers = [];


    statusDisplay.textContent =
        `${from.number} → ${to.number} を対象として登録しました。`;

});


// ======================================================
// 矢印作成
// ======================================================

function createArrow(relation) {

    const from =
        relation.from;

    const to =
        relation.to;


    const rect =
        from.field.getBoundingClientRect();


    // 同じフィールドの場合
    if (from.field === to.field) {

        const x1 =
            from.x;

        const y1 =
            from.y;

        const x2 =
            to.x;

        const y2 =
            to.y;


        drawArrow(
            from.field,
            x1,
            y1,
            x2,
            y2,
            relation
        );

        return;

    }


    // 別フィールドの場合
    // それぞれの画面位置を取得

    const fromRect =
        from.field.getBoundingClientRect();

    const toRect =
        to.field.getBoundingClientRect();


    const x1 =
        fromRect.left +
        from.x;

    const y1 =
        fromRect.top +
        from.y;


    const x2 =
        toRect.left +
        to.x;

    const y2 =
        toRect.top +
        to.y;


    drawGlobalArrow(
        x1,
        y1,
        x2,
        y2,
        relation
    );

}


// ======================================================
// 同じフィールド用矢印
// ======================================================

function drawArrow(
    field,
    x1,
    y1,
    x2,
    y2,
    relation
) {

    const arrow =
        document.createElement("div");

    arrow.className =
        "relation-arrow";


    const dx =
        x2 - x1;

    const dy =
        y2 - y1;


    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const angle =
        Math.atan2(dy, dx) *
        180 /
        Math.PI;


    arrow.style.left =
        x1 + "px";

    arrow.style.top =
        y1 + "px";

    arrow.style.width =
        length + "px";

    arrow.style.transform =
        `rotate(${angle}deg)`;


    relation.element =
        arrow;


    field.appendChild(arrow);

}


// ======================================================
// 別フィールド用矢印
// ======================================================

function drawGlobalArrow(
    x1,
    y1,
    x2,
    y2,
    relation
) {

    const arrow =
        document.createElement("div");

    arrow.className =
        "relation-arrow";


    const dx =
        x2 - x1;

    const dy =
        y2 - y1;


    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const angle =
        Math.atan2(dy, dx) *
        180 /
        Math.PI;


    arrow.style.position =
        "fixed";

    arrow.style.left =
        x1 + "px";

    arrow.style.top =
        y1 + "px";

    arrow.style.width =
        length + "px";

    arrow.style.transform =
        `rotate(${angle}deg)`;


    relation.element =
        arrow;


    document.body.appendChild(arrow);

}


// ======================================================
// 消しゴム
// ======================================================

eraserButton.addEventListener("click", () => {

    if (markers.length === 0) {

        statusDisplay.textContent =
            "消すものがありません。";

        return;

    }


    const marker =
        markers[markers.length - 1];


    // このマーカーに関係する矢印を削除
    relations = relations.filter(
        relation => {

            if (
                relation.from === marker ||
                relation.to === marker
            ) {

                if (relation.element) {

                    relation.element.remove();

                }

                return false;

            }

            return true;

        }
    );


    // マーカー削除
    if (marker.element) {

        marker.element.remove();

    }


    markers.pop();


    statusDisplay.textContent =
        `${marker.number} を削除しました。`;

});


// ======================================================
// 番号リセット
// ======================================================

resetNumberButton.addEventListener(
    "click",
    () => {

        selfNumberCounter = 1;
        opponentNumberCounter = 1;

        statusDisplay.textContent =
            "自分・相手の番号をリセットしました。";
    }
);

// ==========================
// ==========================
// 編集履歴
// ==========================

const historyDisplay = document.getElementById("history");

window.editHistory = [];


// 履歴を追加する
function addHistory(text) {

    console.log("発動時のselectedMarkers:", selectedMarkers);

    const video =
        document.getElementById("video-preview");

const history = {
    text: text,
    time: video.currentTime,
    duration: 3,

    markerId: selectedMarkers.length === 1
        ? selectedMarkers[0].id
        : null,

    markerNumber: selectedMarkers.length === 1
        ? selectedMarkers[0].number
        : null,

    x: selectedMarkers.length === 1
        ? selectedMarkers[0].x
        : null,

    y: selectedMarkers.length === 1
        ? selectedMarkers[0].y
        : null
};

    editHistory.push(history);

    console.log("発動履歴を追加:", history);

    // 動画上に表示
    if (history.markerId !== null) {

        const marker =
            markers.find(marker =>
                marker.id === history.markerId
            );

        if (marker) {

            const videoOverlay =
                document.getElementById("video-overlay");

            const overlayMarker =
                document.createElement("div");

            overlayMarker.textContent =
                marker.number;

            overlayMarker.style.position =
                "absolute";

overlayMarker.style.left =
    history.x + "px";

overlayMarker.style.top =
    history.y + "px";

            overlayMarker.style.fontSize =
                "30px";

            overlayMarker.style.color =
                "transparent";

 videoOverlay.appendChild(
    overlayMarker
);

history.overlayElement = overlayMarker;
        }
    }

    renderHistory();

}

window.addHistory = addHistory;

// 履歴を画面に表示する
function renderHistory() {

    historyDisplay.innerHTML = "";

    if (editHistory.length === 0) {

        historyDisplay.innerHTML =
            "<p>まだ編集履歴はありません。</p>";

        return;
    }


    editHistory.forEach((item, index) => {

        const historyItem =
            document.createElement("div");

        historyItem.className =
            "history-item";


        historyItem.addEventListener("click", () => {

            const video =
                document.getElementById("video-preview");

            video.currentTime = item.time;

        });


        const number =
            document.createElement("span");

        number.className =
            "history-number";

        number.textContent =
            index + 1;

let markerNumber =
    item.markerNumber ?? "";

        const text =
            document.createElement("span");

        text.className =
            "history-text";

text.textContent =
    `${markerNumber ? markerNumber + "　" : ""}${(item.time ?? 0).toFixed(2)}秒　${item.text}`;

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "history-delete";

        deleteButton.textContent =
            "削除";


      deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();

    // この履歴に対応する動画上の番号を削除
    if (item.overlayElement) {
        item.overlayElement.remove();
    }

    // 履歴を削除
    editHistory.splice(index, 1);

    renderHistory();
});


        historyItem.appendChild(number);

        historyItem.appendChild(text);

        historyItem.appendChild(deleteButton);

        historyDisplay.appendChild(historyItem);

    });

}

});