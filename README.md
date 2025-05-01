# Online Wallet 💳 + Real-time Chat 💬

A secure financial platform with integrated real-time chat functionality. Users can perform transactions (transfers, payments, wallet charging) and communicate instantly via an in-app chat system. Built with role-based access control and end-to-end encryption.

---

## ✨ Key Features
- **Peer-to-Peer Transfers**: Instant money transfers between users.
- **Company Payments**: Pay invoices using wallet balance.
- **Wallet Charging**: Top-up via authorized charging points.
- **Real-Time Chat**: In-app messaging with notifications and history.
- **Role-Based Access Control (RBAC)**: Secure permissions for all roles.

---

## 👥 User Roles
| Role             | Capabilities                               |
|------------------|--------------------------------------------|
| **User**         | Transfer funds, pay companies, chat        |
| **Charging Point**| Charge wallets                            |
| **System Owner** | Monitor system, manage charging points     |
| **Admin**        | Full system control, manage roles          |

---

## 🛠 Tech Stack
| Component        | Technologies Used                          |
|------------------|--------------------------------------------|
| **Frontend**     | React, Redux, Material-UI, Socket.io       |
| **Backend**      | Node.js, Express.js, REST API, Socket.io   |
| **Database**     | MySQL, Sequelize ORM                       |
| **Authentication**| JWT, Bcrypt, OAuth2 (Gmail)               |
| **Real-Time Chat**| WebSocket, Socket.io, Redis (for caching) |

---

## 🔐 Authentication & Chat Endpoints
| Service          | Method  | Endpoint                    | Description          |
|------------------|---------|-----------------------------|----------------------|
| User Login       | `POST`  | `/login`                    | Standard user login  |
| Admin Login      | `POST`  | `/web/auth/login/admin`     | Admin login          |
| Send Message     | `POST`  | `/api/chat/send`            | Send chat message    |
| Fetch Messages   | `GET`   | `/api/chat/history`         | Retrieve chat history|

---

## ⚡ Local Setup
### Prerequisites:
- Node.js (v18+)
- MySQL (v8+)
- Redis (for chat caching)

### Installation Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/yourname/online-wallet-chat.git
   cd online-wallet-chat
