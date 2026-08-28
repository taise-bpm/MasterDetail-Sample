
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
    public class MasterDetailDomainServiceTests
    {
        private readonly Mock<IRepositoryContext> _repositoryMock;private readonly Mock<IDomainServiceContext> _domainServiceMock;
        private readonly MasterDomainService _service;

        public MasterDetailDomainServiceTests()
        {
            _repositoryMock = new Mock<IRepositoryContext>();_domainServiceMock = new Mock<IDomainServiceContext>();
            _service = new MasterDomainService(_domainServiceMock.Object, _repositoryMock.Object);
        }

        
		#region MasterDomainService

        [Fact]
        public async Task GetAllMasterAsync_ShouldReturnAllMasters()
        {
            // Arrange
            var Masters = new List<MasterRecord>
            {
                new MasterRecord { MasterId = 1 },
                new MasterRecord { MasterId = 2 }
            };
            _repositoryMock.Setup(x => x.MasterRepository.GetAllAsync(Database.NonScalling, false))
                .ReturnsAsync(Masters);

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(Masters.Count, result.Count);
        }

        [Fact]
        public async Task GetMasterByIdAsync_ShouldReturnMaster_WhenFound()
        {
            // Arrange
            var MasterId = 1;
            var Master = new MasterRecord { MasterId = 1 };
            _repositoryMock.Setup(x => x.MasterRepository.GetByIdAsync(Database.NonScalling, MasterId, false))
                .ReturnsAsync(Master);

            // Act
            var result = await _service.GetMasterByIdAsync(MasterId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(Master.MasterId, result.MasterId);
        }

        [Fact]
        public async Task GetMasterByIdAsync_ShouldReturnNull_WhenNotFound()
        {
            // Arrange
            var MasterId = 1;
            _repositoryMock.Setup(x => x.MasterRepository.GetByIdAsync(Database.NonScalling, MasterId, false))
                .ReturnsAsync((MasterRecord)null);

            // Act
            var result = await _service.GetMasterByIdAsync(MasterId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateMasterAsync_ShouldReturnCreatedMaster()
        {
            // Arrange
            var Master = new MasterRecord { MasterId = 1 };
            _repositoryMock.Setup(x => x.MasterRepository.CreateAsync(Database.NonScalling, Master, false))
                .ReturnsAsync(Master);

            // Act
            var result = await _service.CreateMasterAsync(Master);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(Master.MasterId, result.MasterId);
        }

        [Fact]
        public async Task UpdateMasterAsync_ShouldReturnTrue_WhenUpdateSuccessful()
        {
            // Arrange
            var Master = new MasterRecord { MasterId = 1 };
            _repositoryMock.Setup(x => x.MasterRepository.UpdateAsync(Database.NonScalling, Master, false))
                .ReturnsAsync(1);

            // Act
            var result = await _service.UpdateMasterAsync(Master);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task UpdateMasterAsync_ShouldReturnFalse_WhenUpdateFails()
        {
            // Arrange
            var Master = new MasterRecord { MasterId = 1 };
            _repositoryMock.Setup(x => x.MasterRepository.UpdateAsync(Database.NonScalling, Master, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.UpdateMasterAsync(Master);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task DeleteMasterAsync_ShouldReturnTrue_WhenDeleteSuccessful()
        {
            // Arrange
            var Master = new MasterRecord { MasterId = 1 };
            _repositoryMock.Setup(x => x.MasterRepository.DeleteAsync(Database.NonScalling, Master, false))
                .ReturnsAsync(1);

            // Act
            var result = await _service.DeleteMasterAsync(Master);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task DeleteMasterAsync_ShouldReturnFalse_WhenDeleteFails()
        {
            // Arrange
            var Master = new MasterRecord { MasterId = 1 };
            _repositoryMock.Setup(x => x.MasterRepository.DeleteAsync(Database.NonScalling, Master, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.DeleteMasterAsync(Master);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task BulkCreateMasterAsync_ShouldReturnCreatedMasters()
        {
            // Arrange
            var Masters = new List<MasterRecord>
            {
                new MasterRecord {MasterId = 1},
                new MasterRecord {MasterId = 2}
            };
            _repositoryMock.Setup(x => x.MasterRepository.BulkInsertAsync(Database.NonScalling, Masters, false))
                .ReturnsAsync(Masters);

            // Act
            var result = await _service.BulkCreateMasterAsync(Masters);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(Masters.Count, result.Count);
        }

        [Fact]
        public async Task BulkUpdateMasterAsync_ShouldReturnTrue_WhenUpdateSuccessful()
        {
            // Arrange
            var Masters = new List<MasterRecord>
            {
                new MasterRecord {MasterId = 1},
                new MasterRecord {MasterId = 2}
            };
            _repositoryMock.Setup(x => x.MasterRepository.BulkUpdateAsync(Database.NonScalling, Masters, false))
                .ReturnsAsync(2);

            // Act
            var result = await _service.BulkUpdateMasterAsync(Masters);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task BulkUpdateMasterAsync_ShouldReturnFalse_WhenUpdateFails()
        {
            // Arrange
            var Masters = new List<MasterRecord>
            {
                new MasterRecord {MasterId = 1},
                new MasterRecord {MasterId = 2}
            };
            _repositoryMock.Setup(x => x.MasterRepository.BulkUpdateAsync(Database.NonScalling, Masters, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.BulkUpdateMasterAsync(Masters);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task BulkDeleteMasterAsync_ShouldReturnTrue_WhenDeleteSuccessful()
        {
            // Arrange
            var Masters = new List<MasterRecord>
            {
                new MasterRecord {MasterId = 1},
                new MasterRecord {MasterId = 2}
            };
            _repositoryMock.Setup(x => x.MasterRepository.BulkDeleteAsync(Database.NonScalling, Masters, false))
                .ReturnsAsync(2);

            // Act
            var result = await _service.BulkDeleteMasterAsync(Masters);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task BulkDeleteMasterAsync_ShouldReturnFalse_WhenDeleteFails()
        {
            // Arrange
            var Masters = new List<MasterRecord>
            {
                new MasterRecord {MasterId = 1},
                new MasterRecord {MasterId = 2}
            };
            _repositoryMock.Setup(x => x.MasterRepository.BulkDeleteAsync(Database.NonScalling, Masters, false))
                .ReturnsAsync(0);

            // Act
            var result = await _service.BulkDeleteMasterAsync(Masters);

            // Assert
            Assert.False(result);
        }
        #endregion	
    }
}

  