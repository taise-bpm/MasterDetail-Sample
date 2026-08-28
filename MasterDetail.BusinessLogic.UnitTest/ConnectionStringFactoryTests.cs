
using Microsoft.Extensions.Configuration;
using MasterDetail.BusinessLogic;
using Moq;
using Xunit;

namespace MasterDetail.BusinessLogic.UnitTest
{
    public class ConnectionStringFactoryTests
    {
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly Mock<IConfigurationSection> _connectionStringsSectionMock;

        public ConnectionStringFactoryTests()
        {
            _configurationMock = new Mock<IConfiguration>();
            _connectionStringsSectionMock = new Mock<IConfigurationSection>();
        }

        [Fact]
        public void GetConnectionString_ShouldReturnConnectionString_WhenKeyExists()
        {
            // Arrange
            var expectedConnectionString = "Server=localhost;Database=MasterDetailDB;Trusted_Connection=True;";

            // Setup the section and value
            _configurationMock
                .Setup(x => x.GetSection("ConnectionStrings"))
                .Returns(_connectionStringsSectionMock.Object);

            _connectionStringsSectionMock
                .Setup(x => x["MasterDetailDB"])
                .Returns(expectedConnectionString);

            var factory = new ConnectionStringFactory(_configurationMock.Object);

            // Act
            var result = factory.GetConnectionString();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedConnectionString, result);
        }

        [Fact]
        public void GetConnectionString_ShouldReturnNull_WhenKeyDoesNotExist()
        {
            // Arrange
            _configurationMock
                .Setup(x => x.GetSection("ConnectionStrings"))
                .Returns(_connectionStringsSectionMock.Object);

            _connectionStringsSectionMock
                .Setup(x => x["MasterDetailDB"])
                .Returns((string)null);

            var factory = new ConnectionStringFactory(_configurationMock.Object);

            // Act
            var result = factory.GetConnectionString();

            // Assert
            Assert.Null(result);
        }
    }
}

  