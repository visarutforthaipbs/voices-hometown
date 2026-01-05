# เสียงในหัว คนบ้านฉัน (Voices of My Hometown)

**Voices of My Hometown** is a web application designed to collect and visualize public opinions on local policies during the election period. Developed for **Thai PBS**'s civic engagement network, it empowers citizens to voice their needs relative to their specific location.

![Project Banner](./public/logos/thaipbs.png)

## 🌟 Key Features

### For Citizens (The Survey)
1.  **Location-Based Entry**: Users enter their postal code to identify their subdistrict/district/province.
2.  **Policy Selection**: Users choose the top 3 policies (out of 20 options) that matter most to them.
3.  **Real-Time Feedback**: Submissions are instantly recorded in the central database.
4.  **Personalized Result**: Users receive a personalized summary card of their choices.

### For Administrators (Internal Dashboard)
*   Access via `/monitor`
*   **Real-time Analytics**: View live voting results from across the country.
*   **Regional Filtering**: Filter results by region (North, Northeast, Central, South, Bangkok).
*   **Interactive Charts**: Visualize top policies using dynamic bar charts.

### วิธีการคำนวณคะแนน (Scoring Logic)
ระบบใช้วิธีการคำนวณแบบถ่วงน้ำหนัก (Weighted Scoring) เพื่อสะท้อนความต้องการที่แท้จริงของผู้ใช้ โดยให้คะแนนตามลำดับความสำคัญที่ผู้ใช้เลือก:
*   **อันดับที่ 1 (เลือกเป็นลำดับแรก):** ได้รับ **3 คะแนน**
*   **อันดับที่ 2:** ได้รับ **2 คะแนน**
*   **อันดับที่ 3:** ได้รับ **1 คะแนน**

คะแนนรวม (Total Score) ของแต่ละนโยบายจะถูกคำนวณจากผลรวมคะแนนทั้งหมด แล้วนำมาจัดอันดับเพื่อแสดงผลใน Dashboard วิธีนี้ช่วยให้นโยบายที่ถูกเลือกเป็นอันดับ 1 บ่อยครั้ง มีน้ำหนักมากกว่านโยบายที่ถูกเลือกเป็นลำดับท้ายๆ

## 🛠 Tech Stack

*   **Frontend**: React (Vite) + TypeScript
*   **Styling**: Tailwind CSS + PostCSS
*   **Icons**: Lucide React
*   **Charts**: Recharts
*   **Database**: Firebase Cloud Firestore
*   **Analytics**: Firebase Analytics

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/visarutforthaipbs/voices-hometown.git
    cd voices-of-my-hometown
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up Environment Variables:
    Create a `.env.local` file in the root directory and add your Firebase configuration keys:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

## 📂 Project Structure

```
src/
├── components/        # React components (StageEntry, StageSelection, etc.)
├── config/           # Firebase configuration
├── data/             # Static data (Policies, Postcodes)
├── types/            # TypeScript interfaces
└── App.tsx           # Main application router
```

## © Credits

Developed for **Thai PBS** (The Active & Network Partners).
*   **Logos**: Locals, The Active, Thai PBS.
*   **Fonts**: DB Helvethaica X.
