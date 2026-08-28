using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MasterDetail.BusinessLogic;
using MasterDetail.BusinessLogic.Models;
using MasterDetail.BusinessLogic.Repository;
using MasterDetail.Common;
using Moq;
using Moq.Protected;
using Xunit;

namespace MasterDetail.BusinessLogic.UnitTest.Repository.Test
{
    // NOTE: BaseRepository<T>'s own methods (GetAllAsync, CreateAsync, UpdateAsync, DeleteAsync,
    // BulkInsertAsync, BulkUpdateAsync, BulkDeleteAsync, GetPageSortFilterAsync) talk to SQL Server
    // directly via SqlConnection/SqlDataAdapter with no injectable seam, so they cannot be exercised
    // as true unit tests here. Only MasterRepository's own logic - building the filter clause and
    // delegating to the protected GetByUniqueKey/GetByForeignKey primitives - is unit-testable, so
    // that is what these tests cover. SQL/mapping behavior belongs in an integration test suite.
    public class MasterRepositoryTests
    {
        private readonly Mock<IConnectionStringFactory> _connectionStringFactoryMock;

        public MasterRepositoryTests()
        {
            _connectionStringFactoryMock = new Mock<IConnectionStringFactory>();
        }

        [Fact]
        public async Task GetByIdAsync_ShouldBuildMasterIdFilter_AndDelegateToGetByUniqueKey()
        {
            // Arrange
            var masterId = 1;
            var expected = new MasterRecord { MasterId = 1 };

            var repoMock = new Mock<MasterRepository>(_connectionStringFactoryMock.Object) { CallBase = true };
            repoMock
                .Protected()
                .Setup<Task<MasterRecord>>(
                    "GetByUniqueKey",
                    Database.NonScalling,
                    ItExpr.Is<List<FilterBySetting>>(f => f.Count == 1 && f[0].FilterByClause == "MasterId = " + masterId),
                    ItExpr.IsAny<List<OrderBySetting>>(),
                    false)
                .ReturnsAsync(expected);

            // Act
            var result = await repoMock.Object.GetByIdAsync(Database.NonScalling, masterId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expected.MasterId, result.MasterId);
        }

        [Fact]
        public async Task GetAllByCompanyIdAsync_ShouldBuildCompanyIdFilter_AndDelegateToGetByForeignKey()
        {
            // Arrange
            var companyId = 1;
            var expected = new List<MasterRecord> { new MasterRecord { MasterId = 1 } };

            var repoMock = new Mock<MasterRepository>(_connectionStringFactoryMock.Object) { CallBase = true };
            repoMock
                .Protected()
                .Setup<Task<IEnumerable<MasterRecord>>>(
                    "GetByForeignKey",
                    companyId,
                    ItExpr.Is<List<FilterBySetting>>(f => f.Count == 1 && f[0].FilterByClause == "CompanyId = " + companyId),
                    ItExpr.IsAny<List<OrderBySetting>>(),
                    false)
                .ReturnsAsync(expected);

            // Act
            var result = await repoMock.Object.GetAllByCompanyIdAsync(companyId);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(expected[0].MasterId, result.Single().MasterId);
        }
    }
}
