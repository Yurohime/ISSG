const crypto = require('crypto');

const signature = 'cc9ded59359410dd4bed07b8f5d36c9ef4bd7b2b3da7856ea1ffb917f4dbc90946a8737cda3e297e33ecb1929d1601aa6fa8946b8f8afb86abcf6ae6c04bb253b54963f60201f0fa8ac1ff078e241cce4fb9a950c34d746852592cebee997e8beb05bf0223e6b0c1203565e9aba921b53d41720a5aaf62699b151a157070b68176aab45c11e60ce8a1fff68359c22a65bbcf8426c68abad0a71299a3ba63284165555784acdef364f286251c6c4b7cac2c14d9e056e95769fbe6e113af9a86b4cc9b1f1f92bbc4cd63a137436a1d252fa7c8351ebc22a865346462eb30bf615d4a183ee7ca8c1d4ff8b0d8ea7742ad461dec556bf80bf547636f5f9d6c1f5a08';
const msg = 'I want some apples'; 
const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2UwfebpuI+HgAglFGNJW
pihcHUsPYreYTva5EdYQT+vaHijfGasyQ5Os/AuStd5YXmnLTdcuMxata0JiZp8u
SVZNRx2y/MvJ3Js1CCACee5RtGELJLXO88VxSBAR1iARPnp+x57mLMAy89w5xo7l
wKw4vCUmYtFuRespvVoTkhgiOLeAWZ0ZCM3ofS6rb49ZWr0pgRrnexv6hZHW/a5G
s0moVbyYbHHWNUkvdVvjCdLfaSZ/uN8Q608bpP+Z7FdMeZTcstKoiViaZq6Knspj
BglWaKdVA/NzKx1SFSQzvJsnVvxtia0rXsD5b1+0aD2i3xJeKjbw32IPtuIuqYUn
JwIDAQAB
-----END PUBLIC KEY-----`; 

const verify = crypto.createVerify('SHA256');
verify.update(msg);
verify.end();
const isVerified = verify.verify(publicKeyPem, signature, 'hex');

console.log(`Signature Verification: ${isVerified}`);
console.log(`Message: ${msg}`);