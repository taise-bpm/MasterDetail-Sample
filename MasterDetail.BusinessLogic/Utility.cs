
using System;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Security.Cryptography;
namespace MasterDetail.BusinessLogic
{
    public class Utility
    {
        public static bool IsDBRunning(string ConnectionSTR)
        {
            SqlConnection Con = new()
            {
                //SqlCommand Cmd = new();

                ConnectionString = ConnectionSTR
            };

            try
            {

                Con.Open();
                if (Con.State == ConnectionState.Open)
                {
                    Con.Close();
                    return true;
                }
                else
                {
                    Con.Close();
                    return false;
                }
            }
            catch
            {
                return false;
            }
            finally
            {
                Con.Close();
            }
        }
        public static string HashPassword(string password)
        {
            byte[] salt;
            byte[] buffer2;
            if (password == null)
            {
                throw new ArgumentNullException("password");
            }
            using (Rfc2898DeriveBytes bytes = new(password, new byte[16], 1000, HashAlgorithmName.SHA256))
            {
                salt = bytes.Salt;
                buffer2 = bytes.GetBytes(0x20);
            }
            byte[] dst = new byte[0x31];
            Buffer.BlockCopy(salt, 0, dst, 1, 0x10);
            Buffer.BlockCopy(buffer2, 0, dst, 0x11, 0x20);
            return Convert.ToBase64String(dst);
        }
        public static bool VerifyHashedPassword(string hashedPassword, string password)
        {
            byte[] buffer4;
            if (hashedPassword == null)
            {
                return false;
            }
            if (password == null)
            {
                throw new ArgumentNullException("password");
            }
            byte[] src = Convert.FromBase64String(hashedPassword);
            if ((src.Length != 0x31) || (src[0] != 0))
            {
                return false;
            }
            byte[] dst = new byte[0x10];
            Buffer.BlockCopy(src, 1, dst, 0, 0x10);
            byte[] buffer3 = new byte[0x20];
            Buffer.BlockCopy(src, 0x11, buffer3, 0, 0x20);
            using (Rfc2898DeriveBytes bytes = new(password, new byte[16], 1000, HashAlgorithmName.SHA256))
            {
                buffer4 = bytes.GetBytes(0x20);
            }
            return ByteArraysEqual(buffer3, buffer4);
        }
        static bool ByteArraysEqual(ReadOnlySpan<byte> a1, ReadOnlySpan<byte> a2)
        {
            return a1.SequenceEqual(a2);
        }
        public static string ConvertToPascalCase(string Name)
        {
            Name.ToLower();
            if ((Name == null) || (Name.Length == 0)) return Name;

            string[] words = Name.Split(' ');

            for (int i = 0; i < words.Length; i++)
            {
                if (words[i].Length > 0)
                {
                    string word = words[i];
                    char firstLetter = char.ToUpper(word[0]);
                    words[i] = firstLetter + word.Substring(1);
                    words[i] = words[i] + ' ';
                }
            }

            return string.Join(string.Empty, words).Trim();
        }
    }
}
  