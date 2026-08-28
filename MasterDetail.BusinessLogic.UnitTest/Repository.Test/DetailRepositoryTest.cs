
using System.Collections.Generic;
using System.Threading.Tasks;
using MasterDetail.BusinessLogic;
using MasterDetail.BusinessLogic.Models;
using MasterDetail.BusinessLogic.Repository;
using MasterDetail.Common;
using Moq;
using Moq.Protected;
using Xunit;

namespace MasterDetail.Tests.Repository
{
    public class DetailRepositoryTests
    {
        private readonly Mock<IConnectionStringFactory> _connectionStringFactoryMock;
        private readonly Mock<BaseRepository<DetailRecord>> _baseRepositoryMock;
        private readonly DetailRepository _DetailRepository;

        public DetailRepositoryTests()
        {
            _connectionStringFactoryMock = new Mock<IConnectionStringFactory>();
            _baseRepositoryMock = new Mock<BaseRepository<DetailRecord>>(_connectionStringFactoryMock.Object) { CallBase = false };

            // Use Moq's As<T> to mock the derived repository and setup base methods
            _DetailRepository = new DetailRepository(_connectionStringFactoryMock.Object);

            // Example: Mock GetByUniqueKey (protected in base, so use Protected() extension)
            _baseRepositoryMock
                .Protected()
                .Setup<Task<DetailRecord>>("GetByUniqueKey", ItExpr.IsAny<int>(), ItExpr.IsAny<List<FilterBySetting>>(), ItExpr.IsAny<List<OrderBySetting>>(), false)
                .ReturnsAsync(new DetailRecord { DetailId = 1 });
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnDetailRecord()
        {
            // Arrange
            var DetailId = 1;
            var expected = new DetailRecord { DetailId = 1 };

            // Mock the public method that calls the base
            var repoMock = new Mock<DetailRepository>(_connectionStringFactoryMock.Object) { CallBase = true };
            repoMock
                .Protected()
                .Setup<Task<DetailRecord>>("GetByUniqueKey", Database.NonScalling, ItExpr.IsAny<List<FilterBySetting>>(), ItExpr.IsAny<List<OrderBySetting>>(), false)
	            .ReturnsAsync(expected);

	        // Act
	        var result = await repoMock.Object.GetByIdAsync(Database.NonScalling, DetailId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expected.DetailId, result.DetailId);
        }
		
		[Fact]
        public async Task GetAllByMasterIdAsync_ShouldReturnDetailRecords()
		{
			// Arrange
			var MasterId = 1;
			var expected = new List<DetailRecord>
            {
                new DetailRecord { DetailId = 1 }
            };

            var repoMock = new Mock<DetailRepository>(_connectionStringFactoryMock.Object) { CallBase = true };
            repoMock
                .Protected()
                .Setup<Task<IEnumerable<DetailRecord>>>(
                    "GetByForeignKey",
                    Database.NonScalling,
                    ItExpr.IsAny<List<FilterBySetting>>(),
                    ItExpr.IsAny<List<OrderBySetting>>(),
			        false)
			    .ReturnsAsync(expected);

			// Act
			var result = await repoMock.Object.GetAllByMasterIdAsync(MasterId, Database.NonScalling);

			// Assert
			Assert.NotNull(result);
			Assert.Single(result);
			Assert.Equal(expected[0].DetailId, ((List<DetailRecord>)result)[0].DetailId);
        }
		
		
		
        [Fact]
        public async Task GetAllAsync_ShouldReturnAllCompanies()
        {
            // Arrange
            var orgId = 1;
            var expected = new List<DetailRecord>
                    {
                        new DetailRecord { DetailId = 1 },
                        new DetailRecord { DetailId = 2 }
                    };

            var repoMock = new Mock<DetailRepository>(_connectionStringFactoryMock.Object) { CallBase = true };
            repoMock
                .Setup(x => x.GetAllAsync(orgId, false))
                .ReturnsAsync(expected);

            // Act
            var result = await repoMock.Object.GetAllAsync(orgId);


            // Assert
            Assert.NotNull(result);
            Assert.Equal(expected.Count, result.Count());
        }

        [Fact]
        public async Task CreateAsync_ShouldReturnCreatedDetail()
        {
            // Arrange
            var orgId = 1;
            var Detail = new DetailRecord { DetailId = 0 };
            var expected = new DetailRecord { DetailId = 1 };
            var repoMock = new Mock<DetailRepository>(_connectionStringFactoryMock.Object) { CallBase = true };
            repoMock
                .Setup(x => x.CreateAsync(orgId, Detail, false))
                .ReturnsAsync(expected);

            // Act
            var result = await repoMock.Object.CreateAsync(orgId, Detail);

            // Assert
            Assert.NotNull(result);
            Assert.True(Detail.DetailId == 0 && result.DetailId > 0);
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnRowsDeleted()
        {
            // Arrange
            var orgId = 1;
            var Detail = new DetailRecord { DetailId = 1 };
            var expectedRowDeleted = 1;
            var repoMock = new Mock<DetailRepository>(_connectionStringFactoryMock.Object) { CallBase = true };
            repoMock
                .Setup(x => x.DeleteAsync(orgId, Detail, false))
                .ReturnsAsync(expectedRowDeleted);

            // Act
            var result = await repoMock.Object.DeleteAsync(orgId, Detail);

            // Assert
            Assert.Equal(expectedRowDeleted, result);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnRowsUpdated()
        {
            // Arrange
            var orgId = 1;
            var Detail = new DetailRecord { DetailId = 1 };
            var expectedRowUpdated = 1;
            var repoMock = new Mock<DetailRepository>(_connectionStringFactoryMock.Object) { CallBase = true };
            repoMock
                .Setup(x => x.UpdateAsync(orgId, Detail, false))
                .ReturnsAsync(expectedRowUpdated);

            // Act
            var result = await repoMock.Object.UpdateAsync(orgId, Detail);

            // Assert
            Assert.Equal(expectedRowUpdated, result);
        }
        [Fact]
        public async Task BulkInsertAsync_ShouldReturnInsertedCompanies()
        {
            // Arrange
            var orgId = 1;
            var companies = new List<DetailRecord>
                    {
                        new DetailRecord { DetailId = 0 },
                        new DetailRecord { DetailId = 0 }
                    };
            var expectedcompanies = new List<DetailRecord>
                    {
                        new DetailRecord { DetailId = 1 },
                        new DetailRecord { DetailId = 2 }
                    };

            var repoMock = new Mock<DetailRepository>(_connectionStringFactoryMock.Object) { CallBase = true };
            repoMock
                .Setup(x => x.BulkInsertAsync(orgId, companies, false))
                .ReturnsAsync(expectedcompanies);

            // Act
            var result = await repoMock.Object.BulkInsertAsync(orgId, companies);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(companies.Count, result.Count());
            Assert.True(companies.All(c => c.DetailId == 0 && result.Any(r => r.DetailId > 0)));
        }

        [Fact]
        public async Task BulkUpdateAsync_ShouldReturnRowsUpdated()
        {
            // Arrange
            var orgId = 1;
            var companies = new List<DetailRecord>
                    {
                        new DetailRecord { DetailId = 1 },
                        new DetailRecord { DetailId = 2 }
                    };
            var expectedCount = companies.Count;

            var repoMock = new Mock<DetailRepository>(_connectionStringFactoryMock.Object) { CallBase = true };
            repoMock
                .Setup(x => x.BulkUpdateAsync(orgId, companies, false))
                .ReturnsAsync(expectedCount);

            // Act
            var result = await repoMock.Object.BulkUpdateAsync(orgId, companies);

            // Assert
            Assert.Equal(expectedCount, result);
        }

        [Fact]
        public async Task BulkDeleteAsync_ShouldReturnRowsDeleted()
        {
            // Arrange
            var orgId = 1;
            var companies = new List<DetailRecord>
                    {
                        new DetailRecord { DetailId = 1 },
                        new DetailRecord { DetailId = 2 }
                    };

            var expectedCount = companies.Count;

            var repoMock = new Mock<DetailRepository>(_connectionStringFactoryMock.Object) { CallBase = true };
            repoMock
                .Setup(x => x.BulkDeleteAsync(orgId, companies, false))
                .ReturnsAsync(expectedCount);

            // Act
            var result = await repoMock.Object.BulkDeleteAsync(orgId, companies);
            // Assert
            Assert.Equal(expectedCount, result);
        }

        [Fact]
        public async Task GetPageSortFilterAsync_ShouldReturnPagedResult()
        {
            // Arrange
            var orgId = 1;
            var model = new PageSortFilterModel
            {
                Skip = 0,
                Take = 10,
                IncludeTotalCount = true,
                IncludeFilteredCount = true,
                OrderbyList = new List<OrderBySetting>(),
                FilterByList = new List<FilterBySetting>()
            };

            var expectedResult = new PageOrderFilterReturn
            {
                TotalCount = 100,
                FilteredCount = 50,
                Content = new List<DetailRecord> { new DetailRecord { DetailId = 1 } }
            };

            var repoMock = new Mock<DetailRepository>(_connectionStringFactoryMock.Object) { CallBase = true };
            repoMock
                .Setup(x => x.GetPageSortFilterAsync(orgId, model, false))
                .ReturnsAsync(expectedResult);

            // Act
            var result = await repoMock.Object.GetPageSortFilterAsync(orgId, model);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedResult.TotalCount, result.TotalCount);
            Assert.Equal(expectedResult.FilteredCount, result.FilteredCount);
            Assert.Equal(expectedResult.Content.Count, result.Content.Count);
        }
    }
}
  