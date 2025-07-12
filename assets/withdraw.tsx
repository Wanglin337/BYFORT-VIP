// ✅ File: src/pages/Withdraw.tsx

import React, { useEffect, useState } from 'react'; import { getAuth } from 'firebase/auth'; import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore'; import { useRouter } from 'next/router';

const Withdraw: React.FC = () => { const auth = getAuth(); const db = getFirestore(); const user = auth.currentUser; const router = useRouter();

const [method, setMethod] = useState<'DANA' | 'OVO'>('DANA'); const [target, setTarget] = useState(''); const [amount, setAmount] = useState(''); const [saldo, setSaldo] = useState<number>(0); const [success, setSuccess] = useState(''); const [error, setError] = useState('');

useEffect(() => { const fetchSaldo = async () => { if (!user) return; const userRef = doc(db, 'users', user.uid); const userSnap = await getDoc(userRef); if (userSnap.exists()) { setSaldo(userSnap.data().saldo || 0); } }; fetchSaldo(); }, [user]);

const handleWithdraw = async (e: React.FormEvent) => { e.preventDefault(); setSuccess(''); setError('');

const amountNum = parseInt(amount);
if (!target || !amount) return setError('Semua kolom harus diisi.');
if (isNaN(amountNum) || amountNum < 10000) return setError('Minimal penarikan Rp10.000.');
if (amountNum > saldo) return setError('Saldo tidak mencukupi.');

try {
  await addDoc(collection(db, 'withdrawRequests'), {
    uid: user?.uid,
    method,
    target,
    amount: amountNum,
    status: 'pending',
    timestamp: new Date().toISOString(),
  });
  setSuccess('Permintaan penarikan berhasil dikirim.');
  setAmount('');
  setTarget('');
} catch (err) {
  console.error(err);
  setError('Terjadi kesalahan saat mengirim permintaan.');
}

};

return ( <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow"> <h1 className="text-xl font-bold mb-4">Penarikan Saldo</h1> <p className="mb-2">Saldo kamu: <strong>Rp{saldo.toLocaleString()}</strong></p>

<form onSubmit={handleWithdraw} className="space-y-4">
    <div>
      <label>Metode Pembayaran</label>
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value as 'DANA' | 'OVO')}
        className="w-full p-2 border rounded"
      >
        <option value="DANA">DANA</option>
        <option value="OVO">OVO</option>
      </select>
    </div>

    <div>
      <label>Nomor Tujuan</label>
      <input
        type="text"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="08xxxxxxxx"
        className="w-full p-2 border rounded"
      />
    </div>

    <div>
      <label>Jumlah Penarikan</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="10000"
        className="w-full p-2 border rounded"
      />
    </div>

    {error && <p className="text-red-500">{error}</p>}
    {success && <p className="text-green-600">{success}</p>}

    <button
      type="submit"
      className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
    >
      Tarik Sekarang
    </button>
  </form>
</div>

); };

export default Withdraw;

