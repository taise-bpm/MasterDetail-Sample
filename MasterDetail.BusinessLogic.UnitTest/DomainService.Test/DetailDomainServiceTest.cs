
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MasterDetail.BusinessLogic.DomainServices;
using MasterDetail.BusinessLogic.Models;
using MasterDetail.Common;
using Moq;
using Xunit;

namespace MasterDetail.BusinessLogic.UnitTest.DomainServices.Tests
{
    public class DetailDomainServiceTests
    {
        private readonly Mock<IRepositoryContext> _repositoryMock;private readonly Mock<IDomainServiceContext> _domainServiceMock;
        private readonly DetailDomainService _service;

        public DetailDomainServiceTests()
        {
            _repositoryMock = new Mock<IRepositoryContext>();_domainServiceMock = new Mock<IDomainServiceContext>();
            _service = new DetailDomainService(_domainServiceMock.Object, _repositoryMock.Object);
        }

        #region DetailDomainService
        [Fact]
        public async Task GetAllDetailAsync_ShouldReturnAllDetails()
        {
            // Arrange
            var Details = new List<DetailRecord>
            {
                new DetailRecord { DetailId = 1 },
                new DetailRecord { DetailId = 2 }
            };
            _repositoryMock.Setup(x => x.DetailRepository.GetAllAsync(Database.NonScalling, false))
                .ReturnsAsync(Details);

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(Details.Count, result.Count);
        }

        [Fact]
        public async Task GetDetailByIdAsync_ShouldReturnDetail_WhenFound()
        {
            // Arrange
            var DetailId = 1;
            var Detail = new DetailRecord { DetailId = 1 };
            _repositoryMock.Setup(x => x.DetailRepository.GetByIdAsync(Database.NonScalling, DetailId, false))
                .ReturnsAsync(Detail);

            // Act
            var result = await _service.GetDetailByIdAsync(DetailId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(Detail.DetailId, result.DetailId);
        }

        [Fact]
        public async Task GetDetailByIdAsync_ShouldReturnNull_WhenNotFound()
        {
            // Arrange
            var DetailId = 1;
            _repositoryMock.Setup(x => x.DetailRepository.GetByIdAsync(Database.NonScalling, DetailId, false))
                .ReturnsAsync((DetailRecord)null);

            // Act
            var result = await _service.GetDetailByIdAsync(DetailId);

            // Assert
            Assert.Null(result);
        }
        
		[Fact]
        public async Task GetDetailsByMasterIdAsync_ShouldReturnDetail_WhenFound()
        {
            // Arrange
            var MasterId = 1;
            var Details = new List<DetailRecord>
            {
                new DetailRecord {DetailId = 1, MasterId = 1},
                new DetailRecord {DetailId = 2, MasterId = 1}
            };
            _repositoryMock.Setup(x => x.DetailRepository.GetAllByMasterIdAsync(MasterId, Database.NonScalling, false))
                .ReturnsAsync(Details);

            // Act
            var result = await _service.GetDetailsByMasterIdAsync(MasterId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(Details.Count, result.Count);
        }

        [Fact]
        public async Task GetDetailsByMasterIdAsync_ShouldReturnNull_WhenNotFound()
        {
            // Arrange
            var MasterId = 1;
            var Details = new List<DetailRecord>
            {
                new DetailRecord {DetailId = 1, MasterId = 2},
                new DetailRecord {DetailId = 2, MasterId = 2}
            };
            _repositoryMock.Setup(x => x.DetailRepository.GetAllByMasterIdAsync(MasterId, Database.NonScalling, false))
                .ReturnsAsync(Details.Where(x=>x.MasterId == MasterId));

            // Act
            var result = await _service.GetDetailsByMasterIdAsync(MasterId);

            // Assert
            Assert.True(result.Count == 0);
        }
			
        
        [Fact]
        public async Task CreateDetailAsync_ShouldReturnCreatedDetail()
        {
            // Arrange
            var Detail = new DetailRecord { DetailId = 1 };
            _repositoryMock.Setup(x => x.DetailRepository.CreateAsync(Database.NonScalling, Detail, false))
                .ReturnsAsync(Detail);

            // Act
            var result = await _service.CreateDetailAsync(Detail);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(Detail.DetailId, result.DetailId);
        }

        [Fact]
        public async Task UpdateDetailAsync_ShouldReturnTrue_WhenUpdateSuccessful()
        {
            // Arrange
            var Detail = new DetailRecord { DetailId = 1 };
            _repositoryMock.Setup(x => x.DetailRepository.UpdateAsync(Database.NonScalling, Detail, false))
                .ReturnsAsync(1);

            // Act
            var result = await _service.UpdateDetailAsync(Detail);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task UpdateDetailAsync_ShouldReturnFalse_WhenUpdateFails()
        {
            // Arrange
            var Detail = new DetailRecord { DetailId = 1 };
            _repositoryMock.Setup(x => x.DetailRepository.UpdateAsync(Database.NonScalling, Detail, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.UpdateDetailAsync(Detail);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task DeleteDetailAsync_ShouldReturnTrue_WhenDeleteSuccessful()
        {
            // Arrange
            var Detail = new DetailRecord { DetailId = 1 };
            _repositoryMock.Setup(x => x.DetailRepository.DeleteAsync(Database.NonScalling, Detail, false))
                .ReturnsAsync(1);

            // Act
            var result = await _service.DeleteDetailAsync(Detail);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task DeleteDetailAsync_ShouldReturnFalse_WhenDeleteFails()
        {
            // Arrange
            var Detail = new DetailRecord { DetailId = 1 };
            _repositoryMock.Setup(x => x.DetailRepository.DeleteAsync(Database.NonScalling, Detail, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.DeleteDetailAsync(Detail);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task BulkCreateDetailAsync_ShouldReturnCreatedDetails()
        {
            // Arrange
            var Details = new List<DetailRecord>
            {
                new DetailRecord {DetailId = 1},
                new DetailRecord {DetailId = 2}
            };
            _repositoryMock.Setup(x => x.DetailRepository.BulkInsertAsync(Database.NonScalling, Details, false))
                .ReturnsAsync(Details);

            // Act
            var result = await _service.BulkCreateDetailAsync(Details);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(Details.Count, result.Count);
        }

        [Fact]
        public async Task BulkUpdateDetailAsync_ShouldReturnTrue_WhenUpdateSuccessful()
        {
            // Arrange
            var Details = new List<DetailRecord>
            {
                new DetailRecord {DetailId = 1},
                new DetailRecord {DetailId = 2}
            };
            _repositoryMock.Setup(x => x.DetailRepository.BulkUpdateAsync(Database.NonScalling, Details, false))
                .ReturnsAsync(2);

            // Act
            var result = await _service.BulkUpdateDetailAsync(Details);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task BulkUpdateDetailAsync_ShouldReturnFalse_WhenUpdateFails()
        {
            // Arrange
            var Details = new List<DetailRecord>
            {
                new DetailRecord {DetailId = 1},
                new DetailRecord {DetailId = 2}
            };
            _repositoryMock.Setup(x => x.DetailRepository.BulkUpdateAsync(Database.NonScalling, Details, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.BulkUpdateDetailAsync(Details);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task BulkDeleteDetailAsync_ShouldReturnTrue_WhenDeleteSuccessful()
        {
            // Arrange
            var Details = new List<DetailRecord>
            {
                new DetailRecord {DetailId = 1},
                new DetailRecord {DetailId = 2}
            };
            _repositoryMock.Setup(x => x.DetailRepository.BulkDeleteAsync(Database.NonScalling, Details, false))
                .ReturnsAsync(2);

            // Act
            var result = await _service.BulkDeleteDetailAsync(Details);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task BulkDeleteDetailAsync_ShouldReturnFalse_WhenDeleteFails()
        {
            // Arrange
            var Details = new List<DetailRecord>
            {
                new DetailRecord {DetailId = 1},
                new DetailRecord {DetailId = 2}
            };
            _repositoryMock.Setup(x => x.DetailRepository.BulkDeleteAsync(Database.NonScalling, Details, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.BulkDeleteDetailAsync(Details);

            // Assert
            Assert.False(result);
        }
        #endregion

    }
}

  