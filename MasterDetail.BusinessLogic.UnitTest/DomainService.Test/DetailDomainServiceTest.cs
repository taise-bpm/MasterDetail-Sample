using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MasterDetail.BusinessLogic.DomainServices;
using MasterDetail.BusinessLogic.Models;
using MasterDetail.BusinessLogic.Repository;
using MasterDetail.Common;
using Moq;
using Xunit;

namespace MasterDetail.BusinessLogic.UnitTest.DomainService.Test
{
    public class DetailDomainServiceTests
    {
        private readonly Mock<IRepositoryContext> _repositoryMock;
        private readonly Mock<IDomainServiceContext> _domainServiceMock;
        private readonly DetailDomainService _service;

        public DetailDomainServiceTests()
        {
            _repositoryMock = new Mock<IRepositoryContext>();
            _domainServiceMock = new Mock<IDomainServiceContext>();
            _service = new DetailDomainService(_domainServiceMock.Object, _repositoryMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllDetails()
        {
            // Arrange
            var details = new List<DetailRecord>
            {
                new DetailRecord { DetailId = 1 },
                new DetailRecord { DetailId = 2 }
            };
            _repositoryMock.Setup(x => x.DetailRepository.GetAllAsync(Database.NonScalling, false))
                .ReturnsAsync(details);

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(details.Count, result.Count);
        }

        [Fact]
        public async Task GetDetailByIdAsync_ShouldReturnDetail_WhenFound()
        {
            // Arrange
            var detailId = 1;
            var detail = new DetailRecord { DetailId = 1 };
            _repositoryMock.Setup(x => x.DetailRepository.GetByIdAsync(Database.NonScalling, detailId, false))
                .ReturnsAsync(detail);

            // Act
            var result = await _service.GetDetailByIdAsync(detailId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(detail.DetailId, result.DetailId);
        }

        [Fact]
        public async Task GetDetailByIdAsync_ShouldReturnNull_WhenNotFound()
        {
            // Arrange
            var detailId = 1;
            _repositoryMock.Setup(x => x.DetailRepository.GetByIdAsync(Database.NonScalling, detailId, false))
                .ReturnsAsync((DetailRecord)null);

            // Act
            var result = await _service.GetDetailByIdAsync(detailId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetDetailsByMasterIdAsync_ShouldReturnDetails_WhenFound()
        {
            // Arrange
            var masterId = 1;
            var details = new List<DetailRecord>
            {
                new DetailRecord { DetailId = 1, MasterId = 1 },
                new DetailRecord { DetailId = 2, MasterId = 1 }
            };
            _repositoryMock.Setup(x => x.DetailRepository.GetAllByMasterIdAsync(masterId, Database.NonScalling, false))
                .ReturnsAsync(details);

            // Act
            var result = await _service.GetDetailsByMasterIdAsync(masterId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(details.Count, result.Count);
        }

        [Fact]
        public async Task GetDetailsByMasterIdAsync_ShouldReturnEmptyList_WhenNoneMatchMasterId()
        {
            // Arrange
            var masterId = 1;
            var details = new List<DetailRecord>
            {
                new DetailRecord { DetailId = 1, MasterId = 2 },
                new DetailRecord { DetailId = 2, MasterId = 2 }
            };
            _repositoryMock.Setup(x => x.DetailRepository.GetAllByMasterIdAsync(masterId, Database.NonScalling, false))
                .ReturnsAsync(details.Where(x => x.MasterId == masterId));

            // Act
            var result = await _service.GetDetailsByMasterIdAsync(masterId);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetPageSortFilterAsync_ShouldReturnPagedResult()
        {
            // Arrange
            var model = new PageSortFilterModel
            {
                Skip = 0,
                Take = 10,
                IncludeTotalCount = true,
                IncludeFilteredCount = true,
                OrderbyList = new List<OrderBySetting>(),
                FilterByList = new List<FilterBySetting>()
            };
            var expected = new PageOrderFilterReturn
            {
                TotalCount = 100,
                FilteredCount = 50,
                Content = new List<DetailRecord> { new DetailRecord { DetailId = 1 } }
            };
            _repositoryMock.Setup(x => x.DetailRepository.GetPageSortFilterAsync(Database.NonScalling, model, false))
                .ReturnsAsync(expected);

            // Act
            var result = await _service.GetPageSortFilterAsync(model);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expected.TotalCount, result.TotalCount);
            Assert.Equal(expected.FilteredCount, result.FilteredCount);
            Assert.Equal(expected.Content.Count, result.Content.Count);
        }

        [Fact]
        public async Task CreateDetailAsync_ShouldReturnCreatedDetail()
        {
            // Arrange
            var detail = new DetailRecord { DetailId = 1 };
            _repositoryMock.Setup(x => x.DetailRepository.CreateAsync(Database.NonScalling, detail, false))
                .ReturnsAsync(detail);

            // Act
            var result = await _service.CreateDetailAsync(detail);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(detail.DetailId, result.DetailId);
        }

        [Fact]
        public async Task UpdateDetailAsync_ShouldReturnTrue_WhenUpdateSuccessful()
        {
            // Arrange
            var detail = new DetailRecord { DetailId = 1 };
            _repositoryMock.Setup(x => x.DetailRepository.UpdateAsync(Database.NonScalling, detail, false))
                .ReturnsAsync(1);

            // Act
            var result = await _service.UpdateDetailAsync(detail);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task UpdateDetailAsync_ShouldReturnFalse_WhenUpdateFails()
        {
            // Arrange
            var detail = new DetailRecord { DetailId = 1 };
            _repositoryMock.Setup(x => x.DetailRepository.UpdateAsync(Database.NonScalling, detail, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.UpdateDetailAsync(detail);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task DeleteDetailAsync_ShouldReturnTrue_WhenDeleteSuccessful()
        {
            // Arrange
            var detail = new DetailRecord { DetailId = 1 };
            _repositoryMock.Setup(x => x.DetailRepository.DeleteAsync(Database.NonScalling, detail, false))
                .ReturnsAsync(1);

            // Act
            var result = await _service.DeleteDetailAsync(detail);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task DeleteDetailAsync_ShouldReturnFalse_WhenDeleteFails()
        {
            // Arrange
            var detail = new DetailRecord { DetailId = 1 };
            _repositoryMock.Setup(x => x.DetailRepository.DeleteAsync(Database.NonScalling, detail, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.DeleteDetailAsync(detail);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task BulkCreateDetailAsync_ShouldReturnCreatedDetails()
        {
            // Arrange
            var details = new List<DetailRecord>
            {
                new DetailRecord { DetailId = 1 },
                new DetailRecord { DetailId = 2 }
            };
            _repositoryMock.Setup(x => x.DetailRepository.BulkInsertAsync(Database.NonScalling, details, false))
                .ReturnsAsync(details);

            // Act
            var result = await _service.BulkCreateDetailAsync(details);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(details.Count, result.Count);
        }

        [Fact]
        public async Task BulkUpdateDetailAsync_ShouldReturnTrue_WhenUpdateSuccessful()
        {
            // Arrange
            var details = new List<DetailRecord>
            {
                new DetailRecord { DetailId = 1 },
                new DetailRecord { DetailId = 2 }
            };
            _repositoryMock.Setup(x => x.DetailRepository.BulkUpdateAsync(Database.NonScalling, details, false))
                .ReturnsAsync(2);

            // Act
            var result = await _service.BulkUpdateDetailAsync(details);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task BulkUpdateDetailAsync_ShouldReturnFalse_WhenUpdateFails()
        {
            // Arrange
            var details = new List<DetailRecord>
            {
                new DetailRecord { DetailId = 1 },
                new DetailRecord { DetailId = 2 }
            };
            _repositoryMock.Setup(x => x.DetailRepository.BulkUpdateAsync(Database.NonScalling, details, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.BulkUpdateDetailAsync(details);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task BulkDeleteDetailAsync_ShouldReturnTrue_WhenDeleteSuccessful()
        {
            // Arrange
            var details = new List<DetailRecord>
            {
                new DetailRecord { DetailId = 1 },
                new DetailRecord { DetailId = 2 }
            };
            _repositoryMock.Setup(x => x.DetailRepository.BulkDeleteAsync(Database.NonScalling, details, false))
                .ReturnsAsync(2);

            // Act
            var result = await _service.BulkDeleteDetailAsync(details);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task BulkDeleteDetailAsync_ShouldReturnFalse_WhenDeleteFails()
        {
            // Arrange
            var details = new List<DetailRecord>
            {
                new DetailRecord { DetailId = 1 },
                new DetailRecord { DetailId = 2 }
            };
            _repositoryMock.Setup(x => x.DetailRepository.BulkDeleteAsync(Database.NonScalling, details, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.BulkDeleteDetailAsync(details);

            // Assert
            Assert.False(result);
        }
    }
}
