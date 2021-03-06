let assert = require('assert');
let multisig = require("../src/multisig");
let nacl = require("../src/nacl/naclWrappers");
let address = require("../src/encoding/address");
let passphrase = require("../src/mnemonic/mnemonic");
let encoding = require('../src/encoding/encoding');

describe('Multisig Functionality', function () {

    describe('should generate correct partial signature', function () {
        it('first partial sig should match golden main repo result', function () {
            // Multisig Golden Params
            const params = {
                version: 1,
                threshold: 2,
                pks: [
                    address.decode("DN7MBMCL5JQ3PFUQS7TMX5AH4EEKOBJVDUF4TCV6WERATKFLQF4MQUPZTA").publicKey,
                    address.decode("BFRTECKTOOE7A5LHCF3TTEOH2A7BW46IYT2SX5VP6ANKEXHZYJY77SJTVM").publicKey,
                    address.decode("47YPQTIGQEO7T4Y4RWDYWEKV6RTR2UNBQXBABEEGM72ESWDQNCQ52OPASU").publicKey
                ],
            };
            const multisigAddr = "RWJLJCMQAFZ2ATP2INM2GZTKNL6OULCCUBO5TQPXH3V2KR4AG7U5UA5JNM";
            let mnem1 = "auction inquiry lava second expand liberty glass involve ginger illness length room item discover ahead table doctor term tackle cement bonus profit right above catch";
            let mnem2 = "since during average anxiety protect cherry club long lawsuit loan expand embark forum theory winter park twenty ball kangaroo cram burst board host ability left";
            let mnem3 = "advice pudding treat near rule blouse same whisper inner electric quit surface sunny dismiss leader blood seat clown cost exist hospital century reform able sponsor";

            let o = {
                "snd": Buffer.from(address.decode("RWJLJCMQAFZ2ATP2INM2GZTKNL6OULCCUBO5TQPXH3V2KR4AG7U5UA5JNM").publicKey),
                "rcv": Buffer.from(address.decode("DN7MBMCL5JQ3PFUQS7TMX5AH4EEKOBJVDUF4TCV6WERATKFLQF4MQUPZTA").publicKey),
                "fee": 217000,
                "amt": 5000,
                "fv": 972508,
                "lv": 973508,
                "gen": 'testnet-v31.0',
                "type": 'pay',
                "note": Buffer.from(new Uint8Array([180, 81, 121, 57, 252, 250, 210, 113])),
            };

            let msigTxn = multisig.MultiSigTransaction.from_obj_for_encoding(o);
            let seed = passphrase.seedFromMnemonic(mnem1);
            let sk = nacl.keyPairFromSeed(seed).secretKey;
            let msigBlob = msigTxn.partialSignTxn(params, sk);

            const goldenExpected = Buffer.from([130 ,164 ,109 ,115 ,105 ,103 ,131 ,166 ,115 ,117 ,98 ,115 ,105 ,103 ,147 ,130 ,162 ,112 ,107 ,196 ,32 ,27 ,126 ,192 ,176 ,75 ,234 ,97 ,183 ,150 ,144 ,151 ,230 ,203 ,244 ,7 ,225 ,8 ,167 ,5 ,53 ,29 ,11 ,201 ,138 ,190 ,177 ,34 ,9 ,168 ,171 ,129 ,120 ,161 ,115 ,196 ,64 ,118 ,246 ,119 ,203 ,209 ,172 ,34 ,112 ,79 ,186 ,215 ,112 ,41 ,206 ,201 ,203 ,230 ,167 ,215 ,112 ,156 ,141 ,37 ,117 ,149 ,203 ,209 ,1 ,132 ,10 ,96 ,236 ,87 ,193 ,248 ,19 ,228 ,31 ,230 ,43 ,94 ,17 ,231 ,187 ,158 ,96 ,148 ,216 ,202 ,128 ,206 ,243 ,48 ,88 ,234 ,68 ,38 ,5 ,169 ,86 ,146 ,111 ,121 ,0 ,129 ,162 ,112 ,107 ,196 ,32 ,9 ,99 ,50 ,9 ,83 ,115 ,137 ,240 ,117 ,103 ,17 ,119 ,57 ,145 ,199 ,208 ,62 ,27 ,115 ,200 ,196 ,245 ,43 ,246 ,175 ,240 ,26 ,162 ,92 ,249 ,194 ,113 ,129 ,162 ,112 ,107 ,196 ,32 ,231 ,240 ,248 ,77 ,6 ,129 ,29 ,249 ,243 ,28 ,141 ,135 ,139 ,17 ,85 ,244 ,103 ,29 ,81 ,161 ,133 ,194 ,0 ,144 ,134 ,103 ,244 ,73 ,88 ,112 ,104 ,161 ,163 ,116 ,104 ,114 ,2 ,161 ,118 ,1 ,163 ,116 ,120 ,110 ,137 ,163 ,97 ,109 ,116 ,205 ,19 ,136 ,163 ,102 ,101 ,101 ,206 ,0 ,3 ,79 ,168 ,162 ,102 ,118 ,206 ,0 ,14 ,214 ,220 ,163 ,103 ,101 ,110 ,173 ,116 ,101 ,115 ,116 ,110 ,101 ,116 ,45 ,118 ,51 ,49 ,46 ,48 ,162 ,108 ,118 ,206 ,0 ,14 ,218 ,196 ,164 ,110 ,111 ,116 ,101 ,196 ,8 ,180 ,81 ,121 ,57 ,252 ,250 ,210 ,113 ,163 ,114 ,99 ,118 ,196 ,32 ,27 ,126 ,192 ,176 ,75 ,234 ,97 ,183 ,150 ,144 ,151 ,230 ,203 ,244 ,7 ,225 ,8 ,167 ,5 ,53 ,29 ,11 ,201 ,138 ,190 ,177 ,34 ,9 ,168 ,171 ,129 ,120 ,163 ,115 ,110 ,100 ,196 ,32 ,141 ,146 ,180 ,137 ,144 ,1 ,115 ,160 ,77 ,250 ,67 ,89 ,163 ,102 ,106 ,106 ,252 ,234 ,44 ,66 ,160 ,93 ,217 ,193 ,247 ,62 ,235 ,165 ,71 ,128 ,55 ,233 ,164 ,116 ,121 ,112 ,101 ,163 ,112 ,97 ,121]);
            assert.deepStrictEqual(Buffer.from(msigBlob), goldenExpected);
        });

        it('second partial sig should match golden main repo result', function () {
            // Multisig Golden Params
            const oneSigTxn = Buffer.from([130 ,164 ,109 ,115 ,105 ,103 ,131 ,166 ,115 ,117 ,98 ,115 ,105 ,103 ,147 ,130 ,162 ,112 ,107 ,196 ,32 ,27 ,126 ,192 ,176 ,75 ,234 ,97 ,183 ,150 ,144 ,151 ,230 ,203 ,244 ,7 ,225 ,8 ,167 ,5 ,53 ,29 ,11 ,201 ,138 ,190 ,177 ,34 ,9 ,168 ,171 ,129 ,120 ,161 ,115 ,196 ,64 ,118 ,246 ,119 ,203 ,209 ,172 ,34 ,112 ,79 ,186 ,215 ,112 ,41 ,206 ,201 ,203 ,230 ,167 ,215 ,112 ,156 ,141 ,37 ,117 ,149 ,203 ,209 ,1 ,132 ,10 ,96 ,236 ,87 ,193 ,248 ,19 ,228 ,31 ,230 ,43 ,94 ,17 ,231 ,187 ,158 ,96 ,148 ,216 ,202 ,128 ,206 ,243 ,48 ,88 ,234 ,68 ,38 ,5 ,169 ,86 ,146 ,111 ,121 ,0 ,129 ,162 ,112 ,107 ,196 ,32 ,9 ,99 ,50 ,9 ,83 ,115 ,137 ,240 ,117 ,103 ,17 ,119 ,57 ,145 ,199 ,208 ,62 ,27 ,115 ,200 ,196 ,245 ,43 ,246 ,175 ,240 ,26 ,162 ,92 ,249 ,194 ,113 ,129 ,162 ,112 ,107 ,196 ,32 ,231 ,240 ,248 ,77 ,6 ,129 ,29 ,249 ,243 ,28 ,141 ,135 ,139 ,17 ,85 ,244 ,103 ,29 ,81 ,161 ,133 ,194 ,0 ,144 ,134 ,103 ,244 ,73 ,88 ,112 ,104 ,161 ,163 ,116 ,104 ,114 ,2 ,161 ,118 ,1 ,163 ,116 ,120 ,110 ,137 ,163 ,97 ,109 ,116 ,205 ,19 ,136 ,163 ,102 ,101 ,101 ,206 ,0 ,3 ,79 ,168 ,162 ,102 ,118 ,206 ,0 ,14 ,214 ,220 ,163 ,103 ,101 ,110 ,173 ,116 ,101 ,115 ,116 ,110 ,101 ,116 ,45 ,118 ,51 ,49 ,46 ,48 ,162 ,108 ,118 ,206 ,0 ,14 ,218 ,196 ,164 ,110 ,111 ,116 ,101 ,196 ,8 ,180 ,81 ,121 ,57 ,252 ,250 ,210 ,113 ,163 ,114 ,99 ,118 ,196 ,32 ,27 ,126 ,192 ,176 ,75 ,234 ,97 ,183 ,150 ,144 ,151 ,230 ,203 ,244 ,7 ,225 ,8 ,167 ,5 ,53 ,29 ,11 ,201 ,138 ,190 ,177 ,34 ,9 ,168 ,171 ,129 ,120 ,163 ,115 ,110 ,100 ,196 ,32 ,141 ,146 ,180 ,137 ,144 ,1 ,115 ,160 ,77 ,250 ,67 ,89 ,163 ,102 ,106 ,106 ,252 ,234 ,44 ,66 ,160 ,93 ,217 ,193 ,247 ,62 ,235 ,165 ,71 ,128 ,55 ,233 ,164 ,116 ,121 ,112 ,101 ,163 ,112 ,97 ,121]);
            const params = {
                version: 1,
                threshold: 2,
                pks: [
                    address.decode("DN7MBMCL5JQ3PFUQS7TMX5AH4EEKOBJVDUF4TCV6WERATKFLQF4MQUPZTA").publicKey,
                    address.decode("BFRTECKTOOE7A5LHCF3TTEOH2A7BW46IYT2SX5VP6ANKEXHZYJY77SJTVM").publicKey,
                    address.decode("47YPQTIGQEO7T4Y4RWDYWEKV6RTR2UNBQXBABEEGM72ESWDQNCQ52OPASU").publicKey
                ],
            };
            const multisigAddr = "RWJLJCMQAFZ2ATP2INM2GZTKNL6OULCCUBO5TQPXH3V2KR4AG7U5UA5JNM";
            let mnem1 = "auction inquiry lava second expand liberty glass involve ginger illness length room item discover ahead table doctor term tackle cement bonus profit right above catch";
            let mnem2 = "since during average anxiety protect cherry club long lawsuit loan expand embark forum theory winter park twenty ball kangaroo cram burst board host ability left";
            let mnem3 = "advice pudding treat near rule blouse same whisper inner electric quit surface sunny dismiss leader blood seat clown cost exist hospital century reform able sponsor";

            let o = {
                "snd": Buffer.from(address.decode("RWJLJCMQAFZ2ATP2INM2GZTKNL6OULCCUBO5TQPXH3V2KR4AG7U5UA5JNM").publicKey),
                "rcv": Buffer.from(address.decode("DN7MBMCL5JQ3PFUQS7TMX5AH4EEKOBJVDUF4TCV6WERATKFLQF4MQUPZTA").publicKey),
                "fee": 217000,
                "amt": 5000,
                "fv": 972508,
                "lv": 973508,
                "gen": 'testnet-v31.0',
                "type": 'pay',
                "note": Buffer.from(new Uint8Array([180, 81, 121, 57, 252, 250, 210, 113])),
            };

            let msigTxn = multisig.MultiSigTransaction.from_obj_for_encoding(o);
            let seed = passphrase.seedFromMnemonic(mnem2);
            let sk = nacl.keyPairFromSeed(seed).secretKey;
            let msigBlob = msigTxn.partialSignTxn(params, sk);

            let finMsigBlob = multisig.mergeMultisigTransactions([msigBlob, new Uint8Array(oneSigTxn)]);
            const goldenExpected = Buffer.from([130, 164, 109, 115, 105, 103, 131, 166, 115, 117, 98, 115, 105, 103, 147, 130, 162, 112, 107, 196, 32, 27, 126, 192, 176, 75, 234, 97, 183, 150, 144, 151, 230, 203, 244, 7, 225, 8, 167, 5, 53, 29, 11, 201, 138, 190, 177, 34, 9, 168, 171, 129, 120, 161, 115, 196, 64, 118, 246, 119, 203, 209, 172, 34, 112, 79, 186, 215, 112, 41, 206, 201, 203, 230, 167, 215, 112, 156, 141, 37, 117, 149, 203, 209, 1, 132, 10, 96, 236, 87, 193, 248, 19, 228, 31, 230, 43, 94, 17, 231, 187, 158, 96, 148, 216, 202, 128, 206, 243, 48, 88, 234, 68, 38, 5, 169, 86, 146, 111, 121, 0, 130, 162, 112, 107, 196, 32, 9, 99, 50, 9, 83, 115, 137, 240, 117, 103, 17, 119, 57, 145, 199, 208, 62, 27, 115, 200, 196, 245, 43, 246, 175, 240, 26, 162, 92, 249, 194, 113, 161, 115, 196, 64, 78, 28, 117, 80, 233, 161, 90, 21, 86, 137, 23, 68, 108, 250, 59, 209, 183, 58, 57, 99, 119, 233, 29, 233, 221, 128, 106, 21, 203, 60, 96, 207, 181, 63, 208, 3, 208, 200, 214, 176, 120, 195, 199, 4, 13, 60, 187, 129, 222, 79, 105, 217, 39, 228, 70, 66, 218, 152, 243, 26, 29, 12, 112, 7, 129, 162, 112, 107, 196, 32, 231, 240, 248, 77, 6, 129, 29, 249, 243, 28, 141, 135, 139, 17, 85, 244, 103, 29, 81, 161, 133, 194, 0, 144, 134, 103, 244, 73, 88, 112, 104, 161, 163, 116, 104, 114, 2, 161, 118, 1, 163, 116, 120, 110, 137, 163, 97, 109, 116, 205, 19, 136, 163, 102, 101, 101, 206, 0, 3, 79, 168, 162, 102, 118, 206, 0, 14, 214, 220, 163, 103, 101, 110, 173, 116, 101, 115, 116, 110, 101, 116, 45, 118, 51, 49, 46, 48, 162, 108, 118, 206, 0, 14, 218, 196, 164, 110, 111, 116, 101, 196, 8, 180, 81, 121, 57, 252, 250, 210, 113, 163, 114, 99, 118, 196, 32, 27, 126, 192, 176, 75, 234, 97, 183, 150, 144, 151, 230, 203, 244, 7, 225, 8, 167, 5, 53, 29, 11, 201, 138, 190, 177, 34, 9, 168, 171, 129, 120, 163, 115, 110, 100, 196, 32, 141, 146, 180, 137, 144, 1, 115, 160, 77, 250, 67, 89, 163, 102, 106, 106, 252, 234, 44, 66, 160, 93, 217, 193, 247, 62, 235, 165, 71, 128, 55, 233, 164, 116, 121, 112, 101, 163, 112, 97, 121]);
            assert.deepStrictEqual(Buffer.from(finMsigBlob), goldenExpected);
        });
    });

    describe('should sign keyreg transaction types', function () {
        it('first partial sig should match golden main repo result', function () {
            const rawTxBlob = Buffer.from([129, 163, 116, 120, 110, 137, 163, 102, 101, 101, 206, 0, 3, 200, 192, 162, 102, 118, 206, 0, 14, 249, 218, 162, 108, 118, 206, 0, 14, 253, 194, 166, 115, 101, 108, 107, 101, 121, 196, 32, 50, 18, 43, 43, 214, 61, 220, 83, 49, 150, 23, 165, 170, 83, 196, 177, 194, 111, 227, 220, 202, 242, 141, 54, 34, 181, 105, 119, 161, 64, 92, 134, 163, 115, 110, 100, 196, 32, 141, 146, 180, 137, 144, 1, 115, 160, 77, 250, 67, 89, 163, 102, 106, 106, 252, 234, 44, 66, 160, 93, 217, 193, 247, 62, 235, 165, 71, 128, 55, 233, 164, 116, 121, 112, 101, 166, 107, 101, 121, 114, 101, 103, 166, 118, 111, 116, 101, 107, 100, 205, 39, 16, 167, 118, 111, 116, 101, 107, 101, 121, 196, 32, 112, 27, 215, 251, 145, 43, 7, 179, 8, 17, 255, 40, 29, 159, 238, 149, 99, 229, 128, 46, 32, 38, 137, 35, 25, 37, 143, 119, 250, 147, 30, 136, 167, 118, 111, 116, 101, 108, 115, 116, 206, 0, 15, 66, 64]);
            const oneSigTxBlob = Buffer.from([130, 164, 109, 115, 105, 103, 131, 166, 115, 117, 98, 115, 105, 103, 147, 130, 162, 112, 107, 196, 32, 27, 126, 192, 176, 75, 234, 97, 183, 150, 144, 151, 230, 203, 244, 7, 225, 8, 167, 5, 53, 29, 11, 201, 138, 190, 177, 34, 9, 168, 171, 129, 120, 161, 115, 196, 64, 186, 52, 94, 163, 20, 123, 21, 228, 212, 78, 168, 14, 159, 234, 210, 219, 69, 206, 23, 113, 13, 3, 226, 107, 74, 6, 121, 202, 250, 195, 62, 13, 205, 64, 12, 208, 205, 69, 221, 116, 29, 15, 86, 243, 209, 159, 143, 116, 161, 84, 144, 104, 113, 8, 99, 78, 68, 12, 149, 213, 4, 83, 201, 15, 129, 162, 112, 107, 196, 32, 9, 99, 50, 9, 83, 115, 137, 240, 117, 103, 17, 119, 57, 145, 199, 208, 62, 27, 115, 200, 196, 245, 43, 246, 175, 240, 26, 162, 92, 249, 194, 113, 129, 162, 112, 107, 196, 32, 231, 240, 248, 77, 6, 129, 29, 249, 243, 28, 141, 135, 139, 17, 85, 244, 103, 29, 81, 161, 133, 194, 0, 144, 134, 103, 244, 73, 88, 112, 104, 161, 163, 116, 104, 114, 2, 161, 118, 1, 163, 116, 120, 110, 137, 163, 102, 101, 101, 206, 0, 3, 200, 192, 162, 102, 118, 206, 0, 14, 249, 218, 162, 108, 118, 206, 0, 14, 253, 194, 166, 115, 101, 108, 107, 101, 121, 196, 32, 50, 18, 43, 43, 214, 61, 220, 83, 49, 150, 23, 165, 170, 83, 196, 177, 194, 111, 227, 220, 202, 242, 141, 54, 34, 181, 105, 119, 161, 64, 92, 134, 163, 115, 110, 100, 196, 32, 141, 146, 180, 137, 144, 1, 115, 160, 77, 250, 67, 89, 163, 102, 106, 106, 252, 234, 44, 66, 160, 93, 217, 193, 247, 62, 235, 165, 71, 128, 55, 233, 164, 116, 121, 112, 101, 166, 107, 101, 121, 114, 101, 103, 166, 118, 111, 116, 101, 107, 100, 205, 39, 16, 167, 118, 111, 116, 101, 107, 101, 121, 196, 32, 112, 27, 215, 251, 145, 43, 7, 179, 8, 17, 255, 40, 29, 159, 238, 149, 99, 229, 128, 46, 32, 38, 137, 35, 25, 37, 143, 119, 250, 147, 30, 136, 167, 118, 111, 116, 101, 108, 115, 116, 206, 0, 15, 66, 64]);
            const params = {
                version: 1,
                threshold: 2,
                pks: [
                    address.decode("DN7MBMCL5JQ3PFUQS7TMX5AH4EEKOBJVDUF4TCV6WERATKFLQF4MQUPZTA").publicKey,
                    address.decode("BFRTECKTOOE7A5LHCF3TTEOH2A7BW46IYT2SX5VP6ANKEXHZYJY77SJTVM").publicKey,
                    address.decode("47YPQTIGQEO7T4Y4RWDYWEKV6RTR2UNBQXBABEEGM72ESWDQNCQ52OPASU").publicKey
                ],
            };
            const decRawTx = encoding.decode(rawTxBlob).txn;
            let msigTxn = multisig.MultiSigTransaction.from_obj_for_encoding(decRawTx);
            let mnem1 = "auction inquiry lava second expand liberty glass involve ginger illness length room item discover ahead table doctor term tackle cement bonus profit right above catch";
            let seed = passphrase.seedFromMnemonic(mnem1);
            let sk = nacl.keyPairFromSeed(seed).secretKey;
            let msigBlob = msigTxn.partialSignTxn(params, sk);

            assert.deepStrictEqual(Buffer.from(msigBlob), oneSigTxBlob);
        });

        it('second partial sig with 3rd pk should match golden main repo result', function () {
            const rawOneSigTxBlob = Buffer.from([130, 164, 109, 115, 105, 103, 131, 166, 115, 117, 98, 115, 105, 103, 147, 130, 162, 112, 107, 196, 32, 27, 126, 192, 176, 75, 234, 97, 183, 150, 144, 151, 230, 203, 244, 7, 225, 8, 167, 5, 53, 29, 11, 201, 138, 190, 177, 34, 9, 168, 171, 129, 120, 161, 115, 196, 64, 186, 52, 94, 163, 20, 123, 21, 228, 212, 78, 168, 14, 159, 234, 210, 219, 69, 206, 23, 113, 13, 3, 226, 107, 74, 6, 121, 202, 250, 195, 62, 13, 205, 64, 12, 208, 205, 69, 221, 116, 29, 15, 86, 243, 209, 159, 143, 116, 161, 84, 144, 104, 113, 8, 99, 78, 68, 12, 149, 213, 4, 83, 201, 15, 129, 162, 112, 107, 196, 32, 9, 99, 50, 9, 83, 115, 137, 240, 117, 103, 17, 119, 57, 145, 199, 208, 62, 27, 115, 200, 196, 245, 43, 246, 175, 240, 26, 162, 92, 249, 194, 113, 129, 162, 112, 107, 196, 32, 231, 240, 248, 77, 6, 129, 29, 249, 243, 28, 141, 135, 139, 17, 85, 244, 103, 29, 81, 161, 133, 194, 0, 144, 134, 103, 244, 73, 88, 112, 104, 161, 163, 116, 104, 114, 2, 161, 118, 1, 163, 116, 120, 110, 137, 163, 102, 101, 101, 206, 0, 3, 200, 192, 162, 102, 118, 206, 0, 14, 249, 218, 162, 108, 118, 206, 0, 14, 253, 194, 166, 115, 101, 108, 107, 101, 121, 196, 32, 50, 18, 43, 43, 214, 61, 220, 83, 49, 150, 23, 165, 170, 83, 196, 177, 194, 111, 227, 220, 202, 242, 141, 54, 34, 181, 105, 119, 161, 64, 92, 134, 163, 115, 110, 100, 196, 32, 141, 146, 180, 137, 144, 1, 115, 160, 77, 250, 67, 89, 163, 102, 106, 106, 252, 234, 44, 66, 160, 93, 217, 193, 247, 62, 235, 165, 71, 128, 55, 233, 164, 116, 121, 112, 101, 166, 107, 101, 121, 114, 101, 103, 166, 118, 111, 116, 101, 107, 100, 205, 39, 16, 167, 118, 111, 116, 101, 107, 101, 121, 196, 32, 112, 27, 215, 251, 145, 43, 7, 179, 8, 17, 255, 40, 29, 159, 238, 149, 99, 229, 128, 46, 32, 38, 137, 35, 25, 37, 143, 119, 250, 147, 30, 136, 167, 118, 111, 116, 101, 108, 115, 116, 206, 0, 15, 66, 64]);
            const twoSigTxBlob = Buffer.from([130, 164, 109, 115, 105, 103, 131, 166, 115, 117, 98, 115, 105, 103, 147, 130, 162, 112, 107, 196, 32, 27, 126, 192, 176, 75, 234, 97, 183, 150, 144, 151, 230, 203, 244, 7, 225, 8, 167, 5, 53, 29, 11, 201, 138, 190, 177, 34, 9, 168, 171, 129, 120, 161, 115, 196, 64, 186, 52, 94, 163, 20, 123, 21, 228, 212, 78, 168, 14, 159, 234, 210, 219, 69, 206, 23, 113, 13, 3, 226, 107, 74, 6, 121, 202, 250, 195, 62, 13, 205, 64, 12, 208, 205, 69, 221, 116, 29, 15, 86, 243, 209, 159, 143, 116, 161, 84, 144, 104, 113, 8, 99, 78, 68, 12, 149, 213, 4, 83, 201, 15, 129, 162, 112, 107, 196, 32, 9, 99, 50, 9, 83, 115, 137, 240, 117, 103, 17, 119, 57, 145, 199, 208, 62, 27, 115, 200, 196, 245, 43, 246, 175, 240, 26, 162, 92, 249, 194, 113, 130, 162, 112, 107, 196, 32, 231, 240, 248, 77, 6, 129, 29, 249, 243, 28, 141, 135, 139, 17, 85, 244, 103, 29, 81, 161, 133, 194, 0, 144, 134, 103, 244, 73, 88, 112, 104, 161, 161, 115, 196, 64, 172, 133, 89, 89, 172, 158, 161, 188, 202, 74, 255, 179, 164, 146, 102, 110, 184, 236, 130, 86, 57, 39, 79, 127, 212, 165, 55, 237, 62, 92, 74, 94, 125, 230, 99, 40, 182, 163, 187, 107, 97, 230, 207, 69, 218, 71, 26, 18, 234, 149, 97, 177, 205, 152, 74, 67, 34, 83, 246, 33, 28, 144, 156, 3, 163, 116, 104, 114, 2, 161, 118, 1, 163, 116, 120, 110, 137, 163, 102, 101, 101, 206, 0, 3, 200, 192, 162, 102, 118, 206, 0, 14, 249, 218, 162, 108, 118, 206, 0, 14, 253, 194, 166, 115, 101, 108, 107, 101, 121, 196, 32, 50, 18, 43, 43, 214, 61, 220, 83, 49, 150, 23, 165, 170, 83, 196, 177, 194, 111, 227, 220, 202, 242, 141, 54, 34, 181, 105, 119, 161, 64, 92, 134, 163, 115, 110, 100, 196, 32, 141, 146, 180, 137, 144, 1, 115, 160, 77, 250, 67, 89, 163, 102, 106, 106, 252, 234, 44, 66, 160, 93, 217, 193, 247, 62, 235, 165, 71, 128, 55, 233, 164, 116, 121, 112, 101, 166, 107, 101, 121, 114, 101, 103, 166, 118, 111, 116, 101, 107, 100, 205, 39, 16, 167, 118, 111, 116, 101, 107, 101, 121, 196, 32, 112, 27, 215, 251, 145, 43, 7, 179, 8, 17, 255, 40, 29, 159, 238, 149, 99, 229, 128, 46, 32, 38, 137, 35, 25, 37, 143, 119, 250, 147, 30, 136, 167, 118, 111, 116, 101, 108, 115, 116, 206, 0, 15, 66, 64]);
            const params = {
                version: 1,
                threshold: 2,
                pks: [
                    address.decode("DN7MBMCL5JQ3PFUQS7TMX5AH4EEKOBJVDUF4TCV6WERATKFLQF4MQUPZTA").publicKey,
                    address.decode("BFRTECKTOOE7A5LHCF3TTEOH2A7BW46IYT2SX5VP6ANKEXHZYJY77SJTVM").publicKey,
                    address.decode("47YPQTIGQEO7T4Y4RWDYWEKV6RTR2UNBQXBABEEGM72ESWDQNCQ52OPASU").publicKey
                ],
            };
            const decRawTx = encoding.decode(rawOneSigTxBlob).txn;
            let msigTxn = multisig.MultiSigTransaction.from_obj_for_encoding(decRawTx);
            let mnem3 = "advice pudding treat near rule blouse same whisper inner electric quit surface sunny dismiss leader blood seat clown cost exist hospital century reform able sponsor";
            let seed = passphrase.seedFromMnemonic(mnem3);
            let sk = nacl.keyPairFromSeed(seed).secretKey;
            let msigBlob = msigTxn.partialSignTxn(params, sk);

            let finMsigBlob = multisig.mergeMultisigTransactions([msigBlob, new Uint8Array(rawOneSigTxBlob)]);
            assert.deepStrictEqual(Buffer.from(finMsigBlob), twoSigTxBlob);
        });

        it('merging should be symmetric and match golden main repo result', function() {
            const oneAndThreeBlob = Buffer.from([130, 164, 109, 115, 105, 103, 131, 166, 115, 117, 98, 115, 105, 103, 147, 130, 162, 112, 107, 196, 32, 27, 126, 192, 176, 75, 234, 97, 183, 150, 144, 151, 230, 203, 244, 7, 225, 8, 167, 5, 53, 29, 11, 201, 138, 190, 177, 34, 9, 168, 171, 129, 120, 161, 115, 196, 64, 186, 52, 94, 163, 20, 123, 21, 228, 212, 78, 168, 14, 159, 234, 210, 219, 69, 206, 23, 113, 13, 3, 226, 107, 74, 6, 121, 202, 250, 195, 62, 13, 205, 64, 12, 208, 205, 69, 221, 116, 29, 15, 86, 243, 209, 159, 143, 116, 161, 84, 144, 104, 113, 8, 99, 78, 68, 12, 149, 213, 4, 83, 201, 15, 129, 162, 112, 107, 196, 32, 9, 99, 50, 9, 83, 115, 137, 240, 117, 103, 17, 119, 57, 145, 199, 208, 62, 27, 115, 200, 196, 245, 43, 246, 175, 240, 26, 162, 92, 249, 194, 113, 130, 162, 112, 107, 196, 32, 231, 240, 248, 77, 6, 129, 29, 249, 243, 28, 141, 135, 139, 17, 85, 244, 103, 29, 81, 161, 133, 194, 0, 144, 134, 103, 244, 73, 88, 112, 104, 161, 161, 115, 196, 64, 172, 133, 89, 89, 172, 158, 161, 188, 202, 74, 255, 179, 164, 146, 102, 110, 184, 236, 130, 86, 57, 39, 79, 127, 212, 165, 55, 237, 62, 92, 74, 94, 125, 230, 99, 40, 182, 163, 187, 107, 97, 230, 207, 69, 218, 71, 26, 18, 234, 149, 97, 177, 205, 152, 74, 67, 34, 83, 246, 33, 28, 144, 156, 3, 163, 116, 104, 114, 2, 161, 118, 1, 163, 116, 120, 110, 137, 163, 102, 101, 101, 206, 0, 3, 200, 192, 162, 102, 118, 206, 0, 14, 249, 218, 162, 108, 118, 206, 0, 14, 253, 194, 166, 115, 101, 108, 107, 101, 121, 196, 32, 50, 18, 43, 43, 214, 61, 220, 83, 49, 150, 23, 165, 170, 83, 196, 177, 194, 111, 227, 220, 202, 242, 141, 54, 34, 181, 105, 119, 161, 64, 92, 134, 163, 115, 110, 100, 196, 32, 141, 146, 180, 137, 144, 1, 115, 160, 77, 250, 67, 89, 163, 102, 106, 106, 252, 234, 44, 66, 160, 93, 217, 193, 247, 62, 235, 165, 71, 128, 55, 233, 164, 116, 121, 112, 101, 166, 107, 101, 121, 114, 101, 103, 166, 118, 111, 116, 101, 107, 100, 205, 39, 16, 167, 118, 111, 116, 101, 107, 101, 121, 196, 32, 112, 27, 215, 251, 145, 43, 7, 179, 8, 17, 255, 40, 29, 159, 238, 149, 99, 229, 128, 46, 32, 38, 137, 35, 25, 37, 143, 119, 250, 147, 30, 136, 167, 118, 111, 116, 101, 108, 115, 116, 206, 0, 15, 66, 64]);
            const twoAndThreeBlob = Buffer.from([130, 164, 109, 115, 105, 103, 131, 166, 115, 117, 98, 115, 105, 103, 147, 129, 162, 112, 107, 196, 32, 27, 126, 192, 176, 75, 234, 97, 183, 150, 144, 151, 230, 203, 244, 7, 225, 8, 167, 5, 53, 29, 11, 201, 138, 190, 177, 34, 9, 168, 171, 129, 120, 130, 162, 112, 107, 196, 32, 9, 99, 50, 9, 83, 115, 137, 240, 117, 103, 17, 119, 57, 145, 199, 208, 62, 27, 115, 200, 196, 245, 43, 246, 175, 240, 26, 162, 92, 249, 194, 113, 161, 115, 196, 64, 191, 142, 166, 135, 208, 59, 232, 220, 86, 180, 101, 85, 236, 64, 3, 252, 51, 149, 11, 247, 226, 113, 205, 104, 169, 14, 112, 53, 194, 96, 41, 170, 89, 114, 185, 145, 228, 100, 220, 6, 209, 228, 152, 248, 176, 202, 48, 26, 1, 217, 102, 152, 112, 147, 86, 202, 146, 98, 226, 93, 95, 233, 162, 15, 130, 162, 112, 107, 196, 32, 231, 240, 248, 77, 6, 129, 29, 249, 243, 28, 141, 135, 139, 17, 85, 244, 103, 29, 81, 161, 133, 194, 0, 144, 134, 103, 244, 73, 88, 112, 104, 161, 161, 115, 196, 64, 172, 133, 89, 89, 172, 158, 161, 188, 202, 74, 255, 179, 164, 146, 102, 110, 184, 236, 130, 86, 57, 39, 79, 127, 212, 165, 55, 237, 62, 92, 74, 94, 125, 230, 99, 40, 182, 163, 187, 107, 97, 230, 207, 69, 218, 71, 26, 18, 234, 149, 97, 177, 205, 152, 74, 67, 34, 83, 246, 33, 28, 144, 156, 3, 163, 116, 104, 114, 2, 161, 118, 1, 163, 116, 120, 110, 137, 163, 102, 101, 101, 206, 0, 3, 200, 192, 162, 102, 118, 206, 0, 14, 249, 218, 162, 108, 118, 206, 0, 14, 253, 194, 166, 115, 101, 108, 107, 101, 121, 196, 32, 50, 18, 43, 43, 214, 61, 220, 83, 49, 150, 23, 165, 170, 83, 196, 177, 194, 111, 227, 220, 202, 242, 141, 54, 34, 181, 105, 119, 161, 64, 92, 134, 163, 115, 110, 100, 196, 32, 141, 146, 180, 137, 144, 1, 115, 160, 77, 250, 67, 89, 163, 102, 106, 106, 252, 234, 44, 66, 160, 93, 217, 193, 247, 62, 235, 165, 71, 128, 55, 233, 164, 116, 121, 112, 101, 166, 107, 101, 121, 114, 101, 103, 166, 118, 111, 116, 101, 107, 100, 205, 39, 16, 167, 118, 111, 116, 101, 107, 101, 121, 196, 32, 112, 27, 215, 251, 145, 43, 7, 179, 8, 17, 255, 40, 29, 159, 238, 149, 99, 229, 128, 46, 32, 38, 137, 35, 25, 37, 143, 119, 250, 147, 30, 136, 167, 118, 111, 116, 101, 108, 115, 116, 206, 0, 15, 66, 64]);
            const allThreeBlob = Buffer.from([130, 164, 109, 115, 105, 103, 131, 166, 115, 117, 98, 115, 105, 103, 147, 130, 162, 112, 107, 196, 32, 27, 126, 192, 176, 75, 234, 97, 183, 150, 144, 151, 230, 203, 244, 7, 225, 8, 167, 5, 53, 29, 11, 201, 138, 190, 177, 34, 9, 168, 171, 129, 120, 161, 115, 196, 64, 186, 52, 94, 163, 20, 123, 21, 228, 212, 78, 168, 14, 159, 234, 210, 219, 69, 206, 23, 113, 13, 3, 226, 107, 74, 6, 121, 202, 250, 195, 62, 13, 205, 64, 12, 208, 205, 69, 221, 116, 29, 15, 86, 243, 209, 159, 143, 116, 161, 84, 144, 104, 113, 8, 99, 78, 68, 12, 149, 213, 4, 83, 201, 15, 130, 162, 112, 107, 196, 32, 9, 99, 50, 9, 83, 115, 137, 240, 117, 103, 17, 119, 57, 145, 199, 208, 62, 27, 115, 200, 196, 245, 43, 246, 175, 240, 26, 162, 92, 249, 194, 113, 161, 115, 196, 64, 191, 142, 166, 135, 208, 59, 232, 220, 86, 180, 101, 85, 236, 64, 3, 252, 51, 149, 11, 247, 226, 113, 205, 104, 169, 14, 112, 53, 194, 96, 41, 170, 89, 114, 185, 145, 228, 100, 220, 6, 209, 228, 152, 248, 176, 202, 48, 26, 1, 217, 102, 152, 112, 147, 86, 202, 146, 98, 226, 93, 95, 233, 162, 15, 130, 162, 112, 107, 196, 32, 231, 240, 248, 77, 6, 129, 29, 249, 243, 28, 141, 135, 139, 17, 85, 244, 103, 29, 81, 161, 133, 194, 0, 144, 134, 103, 244, 73, 88, 112, 104, 161, 161, 115, 196, 64, 172, 133, 89, 89, 172, 158, 161, 188, 202, 74, 255, 179, 164, 146, 102, 110, 184, 236, 130, 86, 57, 39, 79, 127, 212, 165, 55, 237, 62, 92, 74, 94, 125, 230, 99, 40, 182, 163, 187, 107, 97, 230, 207, 69, 218, 71, 26, 18, 234, 149, 97, 177, 205, 152, 74, 67, 34, 83, 246, 33, 28, 144, 156, 3, 163, 116, 104, 114, 2, 161, 118, 1, 163, 116, 120, 110, 137, 163, 102, 101, 101, 206, 0, 3, 200, 192, 162, 102, 118, 206, 0, 14, 249, 218, 162, 108, 118, 206, 0, 14, 253, 194, 166, 115, 101, 108, 107, 101, 121, 196, 32, 50, 18, 43, 43, 214, 61, 220, 83, 49, 150, 23, 165, 170, 83, 196, 177, 194, 111, 227, 220, 202, 242, 141, 54, 34, 181, 105, 119, 161, 64, 92, 134, 163, 115, 110, 100, 196, 32, 141, 146, 180, 137, 144, 1, 115, 160, 77, 250, 67, 89, 163, 102, 106, 106, 252, 234, 44, 66, 160, 93, 217, 193, 247, 62, 235, 165, 71, 128, 55, 233, 164, 116, 121, 112, 101, 166, 107, 101, 121, 114, 101, 103, 166, 118, 111, 116, 101, 107, 100, 205, 39, 16, 167, 118, 111, 116, 101, 107, 101, 121, 196, 32, 112, 27, 215, 251, 145, 43, 7, 179, 8, 17, 255, 40, 29, 159, 238, 149, 99, 229, 128, 46, 32, 38, 137, 35, 25, 37, 143, 119, 250, 147, 30, 136, 167, 118, 111, 116, 101, 108, 115, 116, 206, 0, 15, 66, 64]);
            let finMsigBlob = multisig.mergeMultisigTransactions(
                [new Uint8Array(twoAndThreeBlob), new Uint8Array(oneAndThreeBlob)]
            );
            let finMsigBlobTwo = multisig.mergeMultisigTransactions(
                [new Uint8Array(oneAndThreeBlob), new Uint8Array(twoAndThreeBlob)]
            );
            assert.deepStrictEqual(Buffer.from(finMsigBlob), allThreeBlob);
            assert.deepStrictEqual(Buffer.from(finMsigBlobTwo), allThreeBlob);
        });
    });

});