let video;
let facemesh;
let predictions = [];
const indices = [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291];
const indices2 = [76,77,90,180,85,16,315,404,320,307,306,408,304,303,302,11,72,73,74,184];

// 左眼外圍點位編號
const leftEyeOutline = [243,190,56,28,27,29,30,247,130,25,110,24,23,22,26,112];

// 嘴巴外圍點位編號（可依需求調整）
const mouthOutline = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88];

function setup() {
  createCanvas(640, 480).position(
    (windowWidth - 640) / 2,
    (windowHeight - 480) / 2
  );
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', results => {
    predictions = results;
  });
}

function modelReady() {
  // 模型載入完成，可選擇顯示訊息
}

function draw() {
  // 不要鏡頭反轉，直接畫
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 先畫第一組紅色線
    stroke(255, 0, 0);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape();

    // 再畫第二組紅色線並填滿黃色
    stroke(255, 0, 0);
    strokeWeight(2);
    fill(255, 255, 0, 200); // 半透明黃色
    beginShape();
    for (let i = 0; i < indices2.length; i++) {
      const idx = indices2[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);

    // 在第一組與第二組之間充滿綠色
    fill(0, 255, 0, 150); // 半透明綠色
    noStroke();
    beginShape();
    // 先畫第一組
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    // 再畫第二組（反向，避免交錯）
    for (let i = indices2.length - 1; i >= 0; i--) {
      const idx = indices2[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);

    stroke(255, 0, 0); // 紅色
    strokeWeight(2);   // 線條粗細可依需求調整

    for (let i = 0; i < leftEyeOutline.length - 1; i++) {
      const idxA = leftEyeOutline[i];
      const idxB = leftEyeOutline[i + 1];
      line(keypoints[idxA][0], keypoints[idxA][1], keypoints[idxB][0], keypoints[idxB][1]);
    }
    // 若要首尾相連，最後一條線
    line(
      keypoints[leftEyeOutline[leftEyeOutline.length - 1]][0],
      keypoints[leftEyeOutline[leftEyeOutline.length - 1]][1],
      keypoints[leftEyeOutline[0]][0],
      keypoints[leftEyeOutline[0]][1]
    );

    // 嘴巴輪廓（可加填色或線條）
    fill(255, 0, 0, 100); // 半透明紅色
    stroke(0, 0, 255);    // 藍色線條
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < mouthOutline.length; i++) {
      const idx = mouthOutline[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}
